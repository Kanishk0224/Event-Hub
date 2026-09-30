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

        // Send confirmation email asynchronously (non-blocking)
        try {
            const nodemailer = require('nodemailer');
            if (process.env.SMTP_HOST && userEmail) {
                const transporter = nodemailer.createTransporter({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT) || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });
                transporter.sendMail({
                    from: `"EventHub" <${process.env.SMTP_USER || 'noreply@eventhub.com'}>`,
                    to: userEmail,
                    subject: `Registration Confirmed: ${eventTitle || 'Event'}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                          <h2 style="color: #4f46e5;">🎟️ Registration Confirmed!</h2>
                          <p>Hi ${userName || 'Attendee'},</p>
                          <p>You have successfully registered for <strong>${eventTitle}</strong>.</p>
                          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
                            <p style="margin: 0; font-weight: bold;">Ticket ID: ${registration.ticketId}</p>
                            <p style="margin: 4px 0; color: #16a34a;">Status: ${registration.status === 'waitlisted' ? 'Waitlisted' : 'Confirmed ✅'}</p>
                          </div>
                          <p style="color: #64748b; font-size: 12px;">Show your QR code at the venue. See you there! 🚀</p>
                          <p style="color: #64748b; font-size: 12px;">— EventHub Team</p>
                        </div>
                    `
                }).catch(() => {}); // Fire and forget
            }

            // Check if event reached full capacity -> send Excel roster to organizer
            const maxCap = eventData?.maxCapacity || eventData?.capacity || 100;
            const currentCount = (eventData?.registeredCount || 0) + 1;
            const orgEmail = eventData?.organizer?.email || eventData?.contactEmail || process.env.ORGANIZER_ALERT_EMAIL;
            if (process.env.SMTP_HOST && orgEmail && currentCount >= maxCap) {
                const allAttendees = await Registration.find({
                    $or: [{ event: effectiveEventId }, { eventId: String(effectiveEventId) }],
                    status: { $ne: "cancelled" }
                });

                const csvHeader = "Ticket ID,Attendee Name,Email,Role,Affiliation,Team,Status,Registration Date\n";
                const csvRows = allAttendees.map(a => 
                    `"${a.ticketId}","${(a.userName || '').replace(/"/g, '""')}","${a.userEmail || ''}","${a.userRole || ''}","${(a.affiliation || '').replace(/"/g, '""')}","${a.teamName || 'Solo'}","${a.status}","${new Date(a.registeredAt || Date.now()).toISOString()}"`
                ).join("\n");
                const csvContent = csvHeader + csvRows;

                const orgTransporter = nodemailer.createTransporter({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT) || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                orgTransporter.sendMail({
                    from: `"EventHub Host Center" <${process.env.SMTP_USER || 'noreply@eventhub.com'}>`,
                    to: orgEmail,
                    subject: `🚨 Event Full: "${eventData.title}" - Attendee Roster Attached`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                          <h2 style="color: #4f46e5;">🎉 Event Reached Maximum Capacity!</h2>
                          <p>Hi ${eventData.organizer?.name || 'Organizer'},</p>
                          <p>Congratulations! Your event <strong>${eventData.title}</strong> has reached its maximum capacity limit of <strong>${maxCap} seats</strong>.</p>
                          <p>Attached is the complete, official <strong>Attendee Roster spreadsheet (.csv format, compatible with Microsoft Excel & Google Sheets)</strong> for check-in management.</p>
                          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #4f46e5;">
                            <p style="margin: 0; font-weight: bold;">Total Registrants: ${allAttendees.length}</p>
                            <p style="margin: 4px 0; color: #64748b;">Event Date: ${new Date(eventData.startDate || Date.now()).toLocaleDateString()}</p>
                          </div>
                          <p style="color: #64748b; font-size: 12px;">— EventHub Automated Dispatch</p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: `${(eventData.title || 'event').replace(/[^a-zA-Z0-9]/g, '_')}_Attendee_Roster.csv`,
                            content: csvContent,
                            contentType: 'text/csv'
                        }
                    ]
                }).catch(() => {});
            }
        } catch (e) {
            // Non-fatal: email is optional
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

