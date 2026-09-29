const Registration = require("../models/Registration");
const Event = require("../models/Event");

const registerForEvent = async (req, res) => {
    try {
        const {
            user,
            userId,
            event,
            eventId,
            userName,
            userEmail,
            userRole,
            affiliation,
            eventTitle,
            teamName,
            teamMembers,
            answers
        } = req.body;

        const effectiveUserId = userId || (user && (user._id || user.id || user));
        const effectiveEventId = eventId || (event && (event._id || event.id || event));

        if (!effectiveUserId || !effectiveEventId) {
            return res.status(400).json({
                message: "User ID and Event ID are required"
            });
        }

        const existingRegistration = await Registration.findOne({
            $or: [
                { user: effectiveUserId, event: effectiveEventId },
                { userId: String(effectiveUserId), eventId: String(effectiveEventId) }
            ]
        });

        if (
            existingRegistration &&
            existingRegistration.status !== "cancelled"
        ) {
            return res.status(400).json({
                message: "User already registered for this event",
                registration: existingRegistration
            });
        }

        let eventData = null;
        if (String(effectiveEventId).match(/^[0-9a-fA-F]{24}$/)) {
            eventData = await Event.findById(effectiveEventId);
        }
        if (!eventData) {
            eventData = await Event.findOne({
                $or: [{ id: String(effectiveEventId) }, { slug: String(effectiveEventId) }]
            });
        }

        let status = "registered";
        if (eventData && (eventData.registeredCount >= (eventData.maxCapacity || eventData.capacity))) {
            status = eventData.allowWaitlist ? "waitlisted" : "registered";
        }

        const ticketId = `EH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

        let registration;
        if (existingRegistration) {
            existingRegistration.status = status;
            existingRegistration.ticketId = existingRegistration.ticketId || ticketId;
            existingRegistration.registeredAt = new Date();
            registration = await existingRegistration.save();
        } else {
            registration = await Registration.create({
                ticketId,
                user: effectiveUserId,
                userId: String(effectiveUserId),
                userName: userName || "Attendee",
                userEmail: userEmail || "",
                userRole: userRole || "student",
                affiliation: affiliation || "",
                event: effectiveEventId,
                eventId: String(effectiveEventId),
                eventTitle: eventTitle || (eventData ? eventData.title : "Event"),
                teamName: teamName || "Individual",
                teamMembers: teamMembers || [],
                answers: answers || {},
                status
            });
        }

        if (status === "registered" && eventData) {
            await Event.findByIdAndUpdate(
                eventData._id,
                { $inc: { registeredCount: 1 } }
            );
        } else if (status === "waitlisted" && eventData) {
            await Event.findByIdAndUpdate(
                eventData._id,
                { $inc: { waitlistCount: 1 } }
            );
        }

        res.status(201).json({
            message:
                status === "registered"
                    ? "Successfully registered for event"
                    : "Event capacity reached. Added to waitlist queue",
            registration
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

const cancelRegistration = async (req, res) => {
    try {
        const id = req.params.id;
        let registration = null;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            registration = await Registration.findById(id);
        }
        if (!registration) {
            registration = await Registration.findOne({
                $or: [{ id: id }, { ticketId: id }]
            });
        }

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        if (registration.status === "cancelled") {
            return res.status(400).json({
                message: "Registration already cancelled"
            });
        }

        const previousStatus = registration.status;
        registration.status = "cancelled";
        await registration.save();

        if (previousStatus === "registered") {
            const targetEventId = registration.eventId || registration.event;
            await Event.findOneAndUpdate(
                { $or: [{ _id: targetEventId }, { id: targetEventId }] },
                { $inc: { registeredCount: -1 } }
            );

            // Promote next waitlisted attendee automatically
            const nextPerson = await Registration.findOne({
                $or: [{ event: targetEventId }, { eventId: String(targetEventId) }],
                status: "waitlisted"
            }).sort({ registeredAt: 1 });

            if (nextPerson) {
                nextPerson.status = "registered";
                await nextPerson.save();

                await Event.findOneAndUpdate(
                    { $or: [{ _id: targetEventId }, { id: targetEventId }] },
                    { $inc: { registeredCount: 1, waitlistCount: -1 } }
                );
            }
        }

        res.json({
            message: "Registration cancelled successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel registration",
            error: error.message
        });
    }
};

const checkInAttendee = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const registration = await Registration.findOne({
            $or: [{ ticketId }, { _id: ticketId.match(/^[0-9a-fA-F]{24}$/) ? ticketId : null }]
        });

        if (!registration) {
            return res.status(404).json({ message: "Registration pass not found" });
        }

        registration.checkedIn = true;
        registration.checkInTime = new Date();
        await registration.save();

        res.json({
            message: "Attendee checked in successfully",
            registration
        });
    } catch (error) {
        res.status(500).json({
            message: "Check-in failed",
            error: error.message
        });
    }
};

const getEventRegistrations = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const registrations = await Registration.find({
            $or: [{ event: eventId }, { eventId: String(eventId) }]
        }).sort({ registeredAt: -1 });

        res.json(registrations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch registrations",
            error: error.message
        });
    }
};

const getUserRegistrations = async (req, res) => {
    try {
        const userId = req.params.userId;
        const registrations = await Registration.find({
            $or: [{ user: userId }, { userId: String(userId) }]
        }).sort({ registeredAt: -1 });

        res.json(registrations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user registrations",
            error: error.message
        });
    }
};

module.exports = {
    registerForEvent,
    cancelRegistration,
    checkInAttendee,
    getEventRegistrations,
    getUserRegistrations
};

