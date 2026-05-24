const express =
require("express");

const router =
express.Router();

const {

    exportLeadCsv,

    exportLeadExcel,

    exportLeadPdf,

    exportRevenueCsv,

    exportFollowupCsv,

    exportEmployeeCsv

} = require(
    "../controllers/reportController"
);


// LEADS
router.get(
    "/leads/csv",
    exportLeadCsv
);

router.get(
    "/leads/excel",
    exportLeadExcel
);

router.get(
    "/leads/pdf",
    exportLeadPdf
);


// REVENUE
router.get(
    "/revenue/csv",
    exportRevenueCsv
);


// FOLLOWUPS
router.get(
    "/followups/csv",
    exportFollowupCsv
);


// EMPLOYEE
router.get(
    "/employees/csv",
    exportEmployeeCsv
);


module.exports = router;