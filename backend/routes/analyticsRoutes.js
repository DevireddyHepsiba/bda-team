const express = require("express");

const router = express.Router();

const {

    getRevenueTrend,

    getRevenueByEmployee,

    getLeadTrend,

    getConversionFunnel,

    getDashboardSummary

} = require(
    "../controllers/analyticsController"
);


// REVENUE TREND
router.get(
    "/revenue-trend",
    getRevenueTrend
);


// EMPLOYEE REVENUE
router.get(
    "/employee-revenue",
    getRevenueByEmployee
);


// LEAD TREND
router.get(
    "/lead-trend",
    getLeadTrend
);


// CONVERSION FUNNEL
router.get(
    "/conversion-funnel",
    getConversionFunnel
);


// DASHBOARD SUMMARY
router.get(
    "/summary",
    getDashboardSummary
);


module.exports = router;