const express =
require("express");

const router =
express.Router();

const {

    getProfile,

    updateProfile,

    changePassword,

    updateNotifications,

    updateTheme

} = require(
    "../controllers/settingsController"
);

const {
    protect
} = require(
    "../middleware/authMiddleware"
);


// GET PROFILE
router.get(
    "/profile",
    protect,
    getProfile
);


// UPDATE PROFILE
router.put(
    "/profile",
    protect,
    updateProfile
);


// CHANGE PASSWORD
router.put(
    "/password",
    protect,
    changePassword
);


// UPDATE NOTIFICATIONS
router.put(
    "/notifications",
    protect,
    updateNotifications
);


// UPDATE THEME
router.put(
    "/theme",
    protect,
    updateTheme
);


module.exports = router;