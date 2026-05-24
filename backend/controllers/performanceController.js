const Lead = require("../model/Lead");



// KPI SUMMARY CARDS
exports.getPerformanceSummary =
async (req, res) => {

    try {

        const totalLeads =
        await Lead.countDocuments();

        const convertedLeads =
        await Lead.countDocuments({
            status: "won"
        });

        const revenueData =
        await Lead.aggregate([

            {
                $match: {
                    status: "won"
                }
            },

            {
                $group: {

                    _id: null,

                    totalRevenue: {
                        $sum: "$budget"
                    }

                }
            }

        ]);

        const totalRevenue =
            revenueData.length > 0
                ? revenueData[0].totalRevenue
                : 0;

        // MOCK CALLS
        const callsMade = 1284;

        res.status(200).json({

            success: true,

            summary: {

                totalLeads,

                convertedLeads,

                totalRevenue,

                callsMade

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }



};


exports.getEmployeeRanking =
async (req, res) => {

    try {

        const ranking =
        await Lead.aggregate([

            {
                $group: {

                    _id: "$employee",

                    leads: {
                        $sum: 1
                    },

                    converted: {

                        $sum: {

                            $cond: [

                                {
                                    $eq: [
                                        "$status",
                                        "won"
                                    ]
                                },

                                1,

                                0

                            ]

                        }

                    },

                    revenue: {

                        $sum: {

                            $cond: [

                                {
                                    $eq: [
                                        "$status",
                                        "won"
                                    ]
                                },

                                "$budget",

                                0

                            ]

                        }

                    }

                }

            }

        ]);



        // SCORE CALCULATION
        const formatted =
        ranking.map((emp) => {

            const conversion =
                emp.leads > 0
                    ? (
                        (
                            emp.converted /
                            emp.leads
                        ) * 100
                    ).toFixed(1)
                    : 0;

            // SCORE LOGIC
            const score = Math.min(

                100,

                Math.round(
                    (
                        conversion * 0.5
                    ) +
                    (
                        emp.revenue /
                        1000000
                    )
                )

            );

            return {

                employee: emp._id,

                leads: emp.leads,

                converted:
                    emp.converted,

                conversion,

                revenue:
                    emp.revenue,

                score

            };

        });


        // SORT BY SCORE
        formatted.sort(
            (a, b) =>
                b.score - a.score
        );


        res.status(200).json({

            success: true,

            employees: formatted

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


exports.getTopPerformer =
async (req, res) => {

    try {

        const data =
        await Lead.aggregate([

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
            },

            {
                $limit: 1
            }

        ]);

        res.status(200).json({

            success: true,

            topPerformer: data[0]

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




exports.getEmployeeDetails =
async (req, res) => {

    try {

        const employee =
        req.params.employee;

        const leads =
        await Lead.find({
            employee
        });

        const total =
        leads.length;

        const converted =
        leads.filter(
            (l) =>
                l.status === "won"
        ).length;

        const revenue =
        leads
            .filter(
                (l) =>
                    l.status === "won"
            )
            .reduce(
                (acc, item) =>
                    acc + item.budget,
                0
            );

        const conversion =
            total > 0
                ? (
                    (
                        converted /
                        total
                    ) * 100
                ).toFixed(1)
                : 0;

        res.status(200).json({

            success: true,

            employee: {

                name: employee,

                total,

                converted,

                revenue,

                conversion

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};