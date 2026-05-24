const bcrypt =
require("bcryptjs");

const User =
require("../model/User");

const Settings =
require("../model/Settings");



// GET PROFILE
exports.getProfile =
async (req, res) => {

    try {

        const user =
        await User.findById(
            req.user.id
        ).select("-password");

        const settings =
        await Settings.findOne({
            user: req.user.id
        });

        res.status(200).json({

            success: true,

            user,

            settings

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


exports.updateProfile =
async (req, res) => {

    try {

        const {
            fullName,
            email,
            phone
        } = req.body;

        const user =
        await User.findByIdAndUpdate(

            req.user.id,

            {
                fullName,
                email,
                phone
            },

            {
                returnDocument: "after"
            }

        ).select("-password");

        res.status(200).json({

            success: true,

            message:
                "Profile updated",

            user

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


exports.changePassword =
async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user =
        await User.findById(
            req.user.id
        );

        const isMatch =
        await bcrypt.compare(

            currentPassword,

            user.password

        );

        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password incorrect"

            });

        }

        const salt =
        await bcrypt.genSalt(10);

        user.password =
        await bcrypt.hash(
            newPassword,
            salt
        );

        await user.save();

        res.status(200).json({

            success: true,

            message:
                "Password changed"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};



exports.updateNotifications =
async (req, res) => {

    try {

        const settings =
        await Settings.findOneAndUpdate(

            {
                user: req.user.id
            },

            {
                notifications:
                    req.body
            },

            {
                upsert: true,

                new: true
            }

        );

        res.status(200).json({

            success: true,

            message:
                "Notifications updated",

            settings

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};



exports.updateTheme =
async (req, res) => {

    try {

        const settings =
        await Settings.findOneAndUpdate(

            {
                user: req.user.id
            },

            {
                theme:
                    req.body.theme
            },

            {
                upsert: true,

                new: true
            }

        );

        res.status(200).json({

            success: true,

            message:
                "Theme updated",

            settings

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};



