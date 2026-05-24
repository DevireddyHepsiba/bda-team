const Lead = require("../model/Lead");



// MONTHLY REVENUE TREND
exports.getRevenueTrend =
async (req, res) => {

    try {

        const revenueTrend =
        await Lead.aggregate([

            {
                $match: {
                    status: "won"
                }
            },

            {
                $group: {

                    _id: {
                        month: {
                            $month: "$createdAt"
                        }
                    },

                    revenue: {
                        $sum: "$budget"
                    }

                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }

        ]);

        const months = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const formatted =
        revenueTrend.map((item) => ({

            month:
                months[item._id.month],

            revenue:
                item.revenue / 100000

        }));

        res.status(200).json({

            success: true,

            revenueTrend: formatted

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getRevenueByEmployee =
async (req, res) => {

    try {

        const employeeRevenue =
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
            },

            {
                $sort: {
                    revenue: -1
                }
            }

        ]);

        const formatted =
        employeeRevenue.map((item) => ({

            name: item._id,

            revenue:
                item.revenue / 100000

        }));

        res.status(200).json({

            success: true,

            employeeRevenue: formatted

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


exports.getLeadTrend =
async (req, res) => {

    try {

        const trend =
        await Lead.aggregate([

            {
                $group: {

                    _id: {
                        month: {
                            $month: "$createdAt"
                        }
                    },

                    leads: {
                        $sum: 1
                    }

                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }

        ]);

        const months = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const formatted =
        trend.map((item) => ({

            month:
                months[item._id.month],

            leads:
                item.leads

        }));

        res.status(200).json({

            success: true,

            leadTrend: formatted

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getConversionFunnel =
async (req, res) => {

    try {

        const statuses = [
            "new",
            "contacted",
            "qualified",
            "negotiation",
            "won"
        ];

        const funnel = [];

        const total =
        await Lead.countDocuments();

        for (const status of statuses) {

            const count =
            await Lead.countDocuments({
                status
            });

            funnel.push({

                stage: status,

                count,

                percentage:
                    total > 0
                        ? (
                            (
                                count / total
                            ) * 100
                        ).toFixed(1)
                        : 0

            });

        }

        res.status(200).json({

            success: true,

            funnel

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getDashboardSummary =
async (req, res) => {

    try {

        const totalLeads =
        await Lead.countDocuments();

        const wonLeads =
        await Lead.countDocuments({
            status: "won"
        });

        const lostLeads =
        await Lead.countDocuments({
            status: "lost"
        });

        const revenue =
        await Lead.aggregate([

            {
                $match: {
                    status: "won"
                }
            },

            {
                $group: {

                    _id: null,

                    total: {
                        $sum: "$budget"
                    }

                }
            }

        ]);

        const totalRevenue =
            revenue.length > 0
                ? revenue[0].total
                : 0;

        const conversionRate =
            totalLeads > 0
                ? (
                    (
                        wonLeads /
                        totalLeads
                    ) * 100
                ).toFixed(1)
                : 0;

        res.status(200).json({

            success: true,

            summary: {

                totalLeads,

                wonLeads,

                lostLeads,

                totalRevenue,

                conversionRate

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};