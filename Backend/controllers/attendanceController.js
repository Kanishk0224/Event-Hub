const Attendance = require("../models/Attendance");
const Registration = require("../models/Registration");

const markAttendance = async (req, res) => {
    try {
        const {
            event,
            user,
            status
        } = req.body;

        if (!event || !user) {
            return res.status(400).json({
                message: "Event and user are required"
            });
        }

        const registration = await Registration.findOne({
            event,
            user,
            status: "registered"
        });

        if (!registration) {
            return res.status(400).json({
                message: "User is not registered for this event"
            });
        }

        const attendance = await Attendance.findOneAndUpdate(
            {
                event,
                user
            },
            {
                event,
                user,
                status: status || "present",
                markedAt: new Date()
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to mark attendance",
            error: error.message
        });
    }
};

const getEventAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({
            event: req.params.eventId
        })
            .populate("user", "name email")
            .populate("event", "title date");

        res.json(attendance);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch attendance",
            error: error.message
        });
    }
};

const getUserAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({
            user: req.params.userId
        })
            .populate("event", "title date")
            .sort({ markedAt: -1 });

        res.json(attendance);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user attendance",
            error: error.message
        });
    }
};

module.exports = {
    markAttendance,
    getEventAttendance,
    getUserAttendance
};
