const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            default: () => `EH-2026-${Math.floor(10000 + Math.random() * 90000)}`
        },

        user: {
            type: mongoose.Schema.Types.Mixed,
            ref: "User"
        },

        userId: {
            type: String,
            default: ""
        },

        userName: {
            type: String,
            default: ""
        },

        userEmail: {
            type: String,
            default: ""
        },

        userRole: {
            type: String,
            default: "student"
        },

        affiliation: {
            type: String,
            default: ""
        },

        event: {
            type: mongoose.Schema.Types.Mixed,
            ref: "Event"
        },

        eventId: {
            type: String,
            default: ""
        },

        eventTitle: {
            type: String,
            default: ""
        },

        teamName: {
            type: String,
            default: "Individual"
        },

        teamMembers: {
            type: Array,
            default: []
        },

        answers: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        checkedIn: {
            type: Boolean,
            default: false
        },

        checkInTime: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["registered", "waitlisted", "cancelled"],
            default: "registered"
        },

        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

registrationSchema.index(
    { user: 1, event: 1 },
    { unique: true, sparse: true }
);

registrationSchema.index(
    { userId: 1, eventId: 1 },
    { unique: true, sparse: true }
);

module.exports = mongoose.model("Registration", registrationSchema);

