const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
    try {
        const {
            user,
            title,
            message,
            type
        } = req.body;

        if (!user || !title || !message) {
            return res.status(400).json({
                message: "User, title and message are required"
            });
        }

        const notification = await Notification.create({
            user,
            title,
            message,
            type
        });

        res.status(201).json({
            message: "Notification created successfully",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
};

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.params.userId
        }).sort({ createdAt: -1 });

        res.json(notifications);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findByIdAndUpdate(
                req.params.id,
                {
                    isRead: true
                },
                {
                    new: true
                }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification =
            await Notification.findByIdAndDelete(
                req.params.id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.json({
            message: "Notification deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete notification",
            error: error.message
        });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification
};
