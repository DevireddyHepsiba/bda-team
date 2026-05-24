const mongoose = require("mongoose");

const followupSchema = new mongoose.Schema({

    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
    },

    client: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["Call", "Meeting", "Email", "WhatsApp"],
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    done: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "Followup",
    followupSchema
);