const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: ""
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        icon: {
            type: String,
            default: "Sparkles"
        },

        color: {
            type: String,
            default: "#0073e6"
        },

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categorySchema);
