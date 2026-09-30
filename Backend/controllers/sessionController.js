const Session = require("../models/Session");

const createSession = async (req, res) => {
    try {
        const session = await Session.create(req.body);

        const populatedSession = await Session.findById(
            session._id
        ).populate("speaker", "name bio organization photo");

        res.status(201).json({
            message: "Session created successfully",
            session: populatedSession
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create session",
            error: error.message
        });
    }
};

const getEventSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            event: req.params.eventId
        })
            .populate(
                "speaker",
                "name bio organization photo"
            )
            .sort({ startTime: 1 });

        res.json(sessions);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch sessions",
            error: error.message
        });
    }
};

const updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate(
            "speaker",
            "name bio organization photo"
        );

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.json({
            message: "Session updated successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update session",
            error: error.message
        });
    }
};

const deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(
            req.params.id
        );

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.json({
            message: "Session deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete session",
            error: error.message
        });
    }
};

module.exports = {
    createSession,
    getEventSessions,
    updateSession,
    deleteSession
};
