const express = require("express");

const {
    getPlatformAnalytics,
    getEventAnalytics
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", getPlatformAnalytics);
router.get("/event/:eventId", getEventAnalytics);

module.exports = router;
