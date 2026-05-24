const Lead = require("../model/Lead");
const { Parser } = require("json2csv");



exports.exportLeads = async (req, res) => {

    const leads = await Lead.find();

    const fields = [
        "leadId",
        "client",
        "company",
        "product",
        "budget",
        "status"
    ];

    const json2csv = new Parser({ fields });

    const csv = json2csv.parse(leads);

    res.header("Content-Type", "text/csv");

    res.attachment("leads.csv");

    return res.send(csv);
};


// ADD LEAD
exports.createLead = async (req, res) => {

    try {

        const count = await Lead.countDocuments();

        const lead = await Lead.create({
            ...req.body,
            leadId: `LD-${1042 + count}`
        });

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// GET ALL LEADS
exports.getLeads = async (req, res) => {

    try {

        const { status, search } = req.query;

        let query = {
            isHidden: false
        };

        // status filter
        if (status) {
            query.status = status;
        }

        // search
        if (search) {
            query.$or = [
                { client: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { product: { $regex: search, $options: "i" } }
            ];
        }

        const leads = await Lead.find(query);

        res.status(200).json({
            success: true,
            count: leads.length,
            leads
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// GET SINGLE LEAD
exports.getSingleLead = async (req, res) => {

    try {

        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            lead
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// UPDATE LEAD
exports.updateLead = async (req, res) => {

    try {

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Lead updated",
            lead
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// DELETE LEAD
exports.deleteLead = async (req, res) => {

    try {

        await Lead.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Lead deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// HIDE LEAD
exports.hideLead = async (req, res) => {

    try {

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            {
                isHidden: true
            },
            {
                new: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Lead hidden",
            lead
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};