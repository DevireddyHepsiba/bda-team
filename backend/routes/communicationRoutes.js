const express = require("express");

const router = express.Router();

const {

    createCommunication,

    getCommunications,

    getSingleCommunication,

    updateCommunication,

    deleteCommunication,

    getCommunicationStats

} = require(
    "../controllers/communicationController"
);


// CREATE
router.post(
    "/",
    createCommunication
);


// GET ALL
router.get(
    "/",
    getCommunications
);


// ANALYTICS
router.get(
    "/stats",
    getCommunicationStats
);


// GET SINGLE
router.get(
    "/:id",
    getSingleCommunication
);


// UPDATE
router.put(
    "/:id",
    updateCommunication
);


// DELETE
router.delete(
    "/:id",
    deleteCommunication
);


module.exports = router;