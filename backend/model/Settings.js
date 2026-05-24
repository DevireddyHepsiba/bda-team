const mongoose =
require("mongoose");

const settingsSchema =
new mongoose.Schema({

    user: {

        type:
            mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    notifications: {

        email: {
            type: Boolean,
            default: true
        },

        followupReminder: {
            type: Boolean,
            default: true
        },

        weeklyDigest: {
            type: Boolean,
            default: false
        }

    },

    theme: {

        type: String,

        enum: [
            "light",
            "dark"
        ],

        default: "light"

    }

}, {
    timestamps: true
});

module.exports =
mongoose.model(
    "Settings",
    settingsSchema
);