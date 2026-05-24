const Lead = require("../model/Lead");


// GET PIPELINE DATA
exports.getPipeline = async (req, res) => {

    try {

        const pipeline = {
            new: [],
            contacted: [],
            qualified: [],
            negotiation: [],
            won: [],
            lost: []
        };

        const leads = await Lead.find({
            isHidden: false
        });

        leads.forEach((lead) => {

            pipeline[lead.status].push(lead);

        });

        res.status(200).json({
            success: true,
            pipeline
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// UPDATE LEAD STATUS (DRAG & DROP)
exports.updateLeadStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Lead status updated",
            lead
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// PIPELINE STATS
exports.getPipelineStats = async (req, res) => {

    try {

        const leads = await Lead.find();

        let totalRevenue = 0;
        let wonRevenue = 0;
        let wonCount = 0;

        leads.forEach((lead) => {

            totalRevenue += lead.budget;

            if (lead.status === "won") {

                wonRevenue += lead.budget;
                wonCount++;

            }

        });

        const conversion =
            leads.length > 0
                ? ((wonCount / leads.length) * 100).toFixed(1)
                : 0;

        res.status(200).json({
            success: true,
            stats: {
                pipelineRevenue: totalRevenue,
                wonRevenue,
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