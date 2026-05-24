const express = require("express");

const router = express.Router();

const {

    getPerformanceSummary,

    getEmployeeRanking,

    getTopPerformer,

    getEmployeeDetails

} = require(
    "../controllers/performanceController"
);


// KPI SUMMARY
router.get(
    "/summary",
    getPerformanceSummary
);


// RANKING
router.get(
    "/ranking",
    getEmployeeRanking
);


// TOP PERFORMER
router.get(
    "/top",
    getTopPerformer
);


// SINGLE EMPLOYEE
router.get(
    "/:employee",
    getEmployeeDetails
);


module.exports = router;