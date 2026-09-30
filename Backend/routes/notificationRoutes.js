const express = require("express");

const {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    sendWhatsAppNotification,
    sendEmailNotification
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/", createNotification);
router.post("/send-whatsapp", sendWhatsAppNotification);
router.post("/send-email", sendEmailNotification);
router.get("/user/:userId", getUserNotifications);
router.put("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
