const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({

    leadId: {
        type: String,
        unique: true
    },

    client: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    product: {
        type: String,
        required: true
    },

    budget: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "new",
            "contacted",
            "qualified",
            "negotiation",
            "won",
            "lost"
        ],
        default: "new"
    },

    employee: {
        type: String
    },

    followUp: {
        type: Date
    },

    source: {
        type: String
    },

    email: {
        type: String
    },

    phone: {
        type: String
    },

    isHidden: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);