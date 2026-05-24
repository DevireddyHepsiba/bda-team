const express = require("express");

const router = express.Router();

const {
    getPipeline,
    updateLeadStatus,
    getPipelineStats
} = require("../controllers/pipelineController");


// GET PIPELINE
router.get("/", getPipeline);


// PIPELINE STATS
router.get("/stats", getPipelineStats);


// UPDATE STATUS
router.put("/:id/status", updateLeadStatus);


module.exports = router;