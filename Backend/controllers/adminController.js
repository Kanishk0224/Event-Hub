const User = require("../models/User");
const Event = require("../models/Event");
const Organization = require("../models/Organization");
const Registration = require("../models/Registration");

const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalEvents = await Event.countDocuments();

        const totalOrganizations =
            await Organization.countDocuments();

        const totalRegistrations =
            await Registration.countDocuments();

        res.json({
            totalUsers,
            totalEvents,
            totalOrganizations,
            totalRegistrations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admin dashboard",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("category", "name")
            .populate("organization", "name")
            .sort({ createdAt: -1 });

        res.json(events);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(
            req.params.id
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};

module.exports = {
    getAdminDashboard,
    getAllUsers,
    getAllEvents,
    deleteUser,
    deleteEvent
};