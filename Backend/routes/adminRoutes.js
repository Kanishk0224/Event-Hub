const express = require("express");

const {
    getAdminDashboard,
    getAllUsers,
    getAllEvents,
    deleteUser,
    deleteEvent
} = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", getAdminDashboard);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/events", getAllEvents);
router.delete("/events/:id", deleteEvent);

module.exports = router;