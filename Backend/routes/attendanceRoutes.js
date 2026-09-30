const express = require("express");

const {
    markAttendance,
    getEventAttendance,
    getUserAttendance
} = require("../controllers/attendanceController");

const router = express.Router();

router.post("/", markAttendance);
router.get("/event/:eventId", getEventAttendance);
router.get("/user/:userId", getUserAttendance);

module.exports = router;
