const express = require("express");

const {
    createSession,
    getEventSessions,
    updateSession,
    deleteSession
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/", createSession);
router.get("/event/:eventId", getEventSessions);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

module.exports = router;
