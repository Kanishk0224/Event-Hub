const Speaker = require("../models/Speaker");

const createSpeaker = async (req, res) => {
    try {
        const speaker = await Speaker.create(req.body);

        res.status(201).json({
            message: "Speaker created successfully",
            speaker
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create speaker",
            error: error.message
        });
    }
};

const getSpeakers = async (req, res) => {
    try {
        const speakers = await Speaker.find().sort({ name: 1 });

        res.json(speakers);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch speakers",
            error: error.message
        });
    }
};

const getSpeakerById = async (req, res) => {
    try {
        const speaker = await Speaker.findById(req.params.id);

        if (!speaker) {
            return res.status(404).json({
                message: "Speaker not found"
            });
        }

        res.json(speaker);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch speaker",
            error: error.message
        });
    }
};

const updateSpeaker = async (req, res) => {
    try {
        const speaker = await Speaker.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!speaker) {
            return res.status(404).json({
                message: "Speaker not found"
            });
        }

        res.json({
            message: "Speaker updated successfully",
            speaker
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update speaker",
            error: error.message
        });
    }
};

const deleteSpeaker = async (req, res) => {
    try {
        const speaker = await Speaker.findByIdAndDelete(
            req.params.id
        );

        if (!speaker) {
            return res.status(404).json({
                message: "Speaker not found"
            });
        }

        res.json({
            message: "Speaker deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete speaker",
            error: error.message
        });
    }
};

module.exports = {
    createSpeaker,
    getSpeakers,
    getSpeakerById,
    updateSpeaker,
    deleteSpeaker
};
