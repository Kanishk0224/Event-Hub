const express = require("express");

const {
    createSpeaker,
    getSpeakers,
    getSpeakerById,
    updateSpeaker,
    deleteSpeaker
} = require("../controllers/speakerController");

const router = express.Router();

router.post("/", createSpeaker);
router.get("/", getSpeakers);
router.get("/:id", getSpeakerById);
router.put("/:id", updateSpeaker);
router.delete("/:id", deleteSpeaker);

module.exports = router;
