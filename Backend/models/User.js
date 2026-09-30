const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["user", "organizer", "admin", "student", "employee", "host"],
            default: "student"
        },

        avatar: {
            type: String,
            default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
        },

        phone: {
            type: String,
            default: ""
        },

        // Student Specific
        college: {
            type: String,
            default: ""
        },
        degree: {
            type: String,
            default: ""
        },
        graduationYear: {
            type: String,
            default: ""
        },

        // Professional / Employee Specific
        company: {
            type: String,
            default: ""
        },
        jobTitle: {
            type: String,
            default: ""
        },
        experienceLevel: {
            type: String,
            default: ""
        },

        // Host / Organizer Specific
        organizationName: {
            type: String,
            default: ""
        },
        institutionName: {
            type: String,
            default: ""
        },
        hostCategory: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },

        // Host 3-Document Verification
        googleBusinessUrl: {
            type: String,
            default: ""
        },
        orgCertificateUrl: {
            type: String,
            default: ""
        },
        idProofUrl: {
            type: String,
            default: ""
        },

        // Verification Workflow
        verified: {
            type: Boolean,
            default: false
        },
        verificationStatus: {
            type: String,
            enum: ["pending_review", "approved", "rejected"],
            default: "pending_review"
        },
        rejectionReason: {
            type: String,
            default: ""
        },

        // Payment method preference
        preferredPaymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "upi", "net_banking", "wallet"],
            default: "upi"
        },

        skills: {
            type: [String],
            default: []
        },

        interests: {
            type: [String],
            default: []
        },

        location: {
            type: String,
            default: ""
        },

        profileImage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
