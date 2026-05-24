const Lead =
require("../model/Lead");

const Followup =
require("../model/Followup");

const Communication =
require("../model/Communication");

const {
    exportCsv
} = require("../utils/exportCsv");

const {
    exportExcel
} = require("../utils/exportExcel");

const {
    exportPdf
} = require("../utils/exportPdf");



// LEAD CSV REPORT
exports.exportLeadCsv =
async (req, res) => {

    try {

        const leads =
        await Lead.find();

        const fields = [

            "leadId",

            "client",

            "company",

            "status",

            "budget",

            "employee"

        ];

        const csv =
        exportCsv(
            leads,
            fields
        );

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            "leads.csv"
        );

        return res.send(csv);

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};


exports.exportLeadExcel =
async (req, res) => {

    try {

        const leads =
        await Lead.find();

        const columns = [

            {
                header: "Lead ID",
                key: "leadId"
            },

            {
                header: "Client",
                key: "client"
            },

            {
                header: "Company",
                key: "company"
            },

            {
                header: "Budget",
                key: "budget"
            },

            {
                header: "Status",
                key: "status"
            }

        ];

        await exportExcel(

            leads,

            columns,

            "lead-report",

            res

        );

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};



exports.exportLeadPdf =
async (req, res) => {

    try {

        const leads =
        await Lead.find();

        exportPdf(

            leads,

            "Lead Report",

            res

        );

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};


exports.exportRevenueCsv =
async (req, res) => {

    try {

        const revenue =
        await Lead.aggregate([

            {
                $match: {
                    status: "won"
                }
            },

            {
                $group: {

                    _id: "$employee",

                    revenue: {
                        $sum: "$budget"
                    }

                }

            }

        ]);

        const csv =
        exportCsv(
            revenue,
            ["_id", "revenue"]
        );

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            "revenue-report.csv"
        );

        return res.send(csv);

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};


exports.exportFollowupCsv =
async (req, res) => {

    try {

        const followups =
        await Followup.find();

        const csv =
        exportCsv(

            followups,

            [

                "client",

                "company",

                "date",

                "priority",

                "done"

            ]

        );

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            "followups.csv"
        );

        return res.send(csv);

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};



exports.exportEmployeeCsv =
async (req, res) => {

    try {

        const employees =
        await Lead.aggregate([

            {
                $group: {

                    _id: "$employee",

                    leads: {
                        $sum: 1
                    },

                    revenue: {
                        $sum: "$budget"
                    }

                }

            }

        ]);

        const csv =
        exportCsv(
            employees,
            ["_id", "leads", "revenue"]
        );

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            "employees.csv"
        );

        return res.send(csv);

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};



