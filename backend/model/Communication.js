const mongoose = require("mongoose");

const communicationSchema =
new mongoose.Schema({

    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
    },

    client: {
        type: String,
        required: true,
        trim: true
    },

    company: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: [
            "Call",
            "Email",
            "Meeting",
            "WhatsApp"
        ],
        required: true
    },

    note: {
        type: String,
        required: true
    },

    outcome: {
        type: String,
        required: true
    },

    employee: {
        type: String
    },

    status: {
        type: String,
        enum: [
            "Interested",
            "Negotiating",
            "Quotation Requested",
            "Awaiting Reply",
            "Deal Won",
            "Deal Lost"
        ],
        default: "Interested"
    },

    date: {
        type: Date,
        default: Date.now
    },

    deleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});


// INDEXING
communicationSchema.index({
    client: "text",
    company: "text",
    note: "text"
});

module.exports =
mongoose.model(
    "Communication",
    communicationSchema
);