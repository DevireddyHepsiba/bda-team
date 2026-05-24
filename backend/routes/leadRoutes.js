const express = require("express");

const router = express.Router();

const {
    createLead,
    getLeads,
    getSingleLead,
    updateLead,
    deleteLead,
    hideLead,
    exportLeads

} = require("../controllers/leadController");



const {
    protect
} = require(
    "../middleware/authMiddleware"
);

const {
    bdaOrAdmin
} = require(
    "../middleware/roleMiddleware"
);


router.post("/", protect,
   bdaOrAdmin, createLead);

router.get("/", protect,
   bdaOrAdmin, getLeads);

router.get("/:id", protect,
   bdaOrAdmin, getSingleLead);

router.put("/:id", protect,
   bdaOrAdmin, updateLead);

router.delete("/:id", protect,
   bdaOrAdmin, deleteLead);

router.put("/hide/:id", protect,
   bdaOrAdmin, hideLead);

router.get("/export/csv", protect,
   bdaOrAdmin, exportLeads);

module.exports = router;