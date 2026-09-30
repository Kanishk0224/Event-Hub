const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        bio: {
            type: String,
            default: ""
        },

        organization: {
            type: String,
            default: ""
        },

        photo: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Speaker", speakerSchema);
