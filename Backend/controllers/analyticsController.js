const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");

const getPlatformAnalytics = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();

        const publishedEvents = await Event.countDocuments({
            status: "published"
        });

        const cancelledEvents = await Event.countDocuments({
            status: "cancelled"
        });

        const totalRegistrations =
            await Registration.countDocuments({
                status: "registered"
            });

        const totalWaitlisted =
            await Registration.countDocuments({
                status: "waitlisted"
            });

        const totalAttendees =
            await Attendance.countDocuments({
                status: "present"
            });

        const eventStatistics =
            await Registration.aggregate([
                {
                    $match: {
                        status: "registered"
                    }
                },
                {
                    $group: {
                        _id: "$event",
                        registrations: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: "events",
                        localField: "_id",
                        foreignField: "_id",
                        as: "event"
                    }
                },
                {
                    $unwind: {
                        path: "$event",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        eventId: "$_id",
                        title: "$event.title",
                        registrations: 1
                    }
                },
                {
                    $sort: {
                        registrations: -1
                    }
                }
            ]);

        res.json({
            totalEvents,
            publishedEvents,
            cancelledEvents,
            totalRegistrations,
            totalWaitlisted,
            totalAttendees,
            eventStatistics
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
};

const getEventAnalytics = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        const totalRegistrations =
            await Registration.countDocuments({
                event: eventId,
                status: "registered"
            });

        const totalWaitlisted =
            await Registration.countDocuments({
                event: eventId,
                status: "waitlisted"
            });

        const totalCancelled =
            await Registration.countDocuments({
                event: eventId,
                status: "cancelled"
            });

        const totalAttendees =
            await Attendance.countDocuments({
                event: eventId,
                status: "present"
            });

        res.json({
            eventId,
            totalRegistrations,
            totalWaitlisted,
            totalCancelled,
            totalAttendees
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event analytics",
            error: error.message
        });
    }
};

module.exports = {
    getPlatformAnalytics,
    getEventAnalytics
};
