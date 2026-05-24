const express = require("express");

const router = express.Router();

const {
    createFollowup,
    getFollowups,
    getCategorizedFollowups,
    markDone,
    deleteFollowup
} = require("../controllers/followupController");


// CREATE
router.post("/", createFollowup);


// GET ALL
router.get("/", getFollowups);


// GET CATEGORIZED
router.get("/categorized", getCategorizedFollowups);


// MARK DONE
router.put("/:id/done", markDone);


// DELETE
router.delete("/:id", deleteFollowup);


module.exports = router;