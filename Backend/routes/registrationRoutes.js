const express = require("express");

const {
    registerForEvent,
    cancelRegistration,
    checkInAttendee,
    getEventRegistrations,
    getUserRegistrations
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", registerForEvent);

router.put(
    "/cancel/:id",
    cancelRegistration
);

router.put(
    "/checkin/:ticketId",
    checkInAttendee
);

router.get(
    "/event/:eventId",
    getEventRegistrations
);

router.get(
    "/user/:userId",
    getUserRegistrations
);

module.exports = router;
