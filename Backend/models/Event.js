const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            default: ""
        },

        tagline: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true,
            default: "hackathon"
        },

        categoryLabel: {
            type: String,
            default: "Hackathon"
        },

        organizer: {
            id: { type: String, default: "" },
            name: { type: String, default: "EventHub Organization" },
            logo: { type: String, default: "" },
            verified: { type: Boolean, default: true },
            email: { type: String, default: "" },
            type: { type: String, default: "Tech Community" }
        },

        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        },

        createdBy: {
            type: mongoose.Schema.Types.Mixed
        },

        location: {
            type: String,
            required: true,
            default: "Online"
        },

        mode: {
            type: String,
            enum: ["Online", "In-Person", "Hybrid", "online", "offline", "hybrid"],
            default: "Hybrid"
        },

        eventType: {
            type: String,
            default: "hybrid"
        },

        startDate: {
            type: String,
            default: ""
        },

        endDate: {
            type: String,
            default: ""
        },

        date: {
            type: Date,
            default: Date.now
        },

        startTime: {
            type: String,
            default: "09:00 AM"
        },

        endTime: {
            type: String,
            default: "06:00 PM"
        },

        registrationDeadline: {
            type: String,
            default: ""
        },

        capacity: {
            type: Number,
            default: 100,
            min: 1
        },

        maxCapacity: {
            type: Number,
            default: 100
        },

        registeredCount: {
            type: Number,
            default: 0
        },

        waitlistCount: {
            type: Number,
            default: 0
        },

        allowWaitlist: {
            type: Boolean,
            default: true
        },

        isFree: {
            type: Boolean,
            default: true
        },

        price: {
            type: Number,
            default: 0
        },

        teamSize: {
            type: String,
            default: "1 - 4 Members"
        },

        eligibility: {
            type: String,
            default: "Open to all students & professionals"
        },

        bannerUrl: {
            type: String,
            default: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80"
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["draft", "published", "cancelled", "completed"],
            default: "published"
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        prizes: {
            type: Array,
            default: []
        },

        perks: {
            type: Array,
            default: []
        },

        schedule: {
            type: Array,
            default: []
        },

        speakers: {
            type: Array,
            default: []
        },

        rounds: {
            type: Array,
            default: []
        },

        faqs: {
            type: Array,
            default: []
        },

        contactEmail: {
            type: String,
            default: ""
        },

        contactPhone: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

// Enforce database-level deduplication: no two events with identical title, date, and venue
eventSchema.index(
    { title: 1, startDate: 1, location: 1 },
    { unique: true, sparse: true }
);

module.exports = mongoose.model("Event", eventSchema);
