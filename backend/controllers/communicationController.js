const Communication =
require("../model/Communication");



// CREATE COMMUNICATION
exports.createCommunication =
async (req, res) => {

    try {

        const communication =
        await Communication.create(
            req.body
        );

        res.status(201).json({
            success: true,
            message:
                "Communication logged",
            communication
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};




// GET ALL COMMUNICATIONS
exports.getCommunications =
async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            search,
            type,
            status,
            sort = "-createdAt"
        } = req.query;

        const query = {
            deleted: false
        };

        // SEARCH
        if (search) {

            query.$text = {
                $search: search
            };

        }

        // FILTER TYPE
        if (type) {

            query.type = type;

        }

        // FILTER STATUS
        if (status) {

            query.status = status;

        }

        const communications =
        await Communication.find(query)

            .sort(sort)

            .skip((page - 1) * limit)

            .limit(Number(limit));

        const total =
        await Communication.countDocuments(
            query
        );

        res.status(200).json({

            success: true,

            total,

            currentPage: Number(page),

            totalPages:
                Math.ceil(total / limit),

            communications

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};




// GET SINGLE COMMUNICATION
exports.getSingleCommunication =
async (req, res) => {

    try {

        const communication =
        await Communication.findById(
            req.params.id
        );

        if (!communication) {

            return res.status(404).json({
                success: false,
                message:
                    "Communication not found"
            });

        }

        res.status(200).json({
            success: true,
            communication
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};




// UPDATE COMMUNICATION
exports.updateCommunication =
async (req, res) => {

    try {

        const communication =
        await Communication.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                returnDocument: "after"
            }

        );

        res.status(200).json({

            success: true,

            message:
                "Communication updated",

            communication

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// DELETE COMMUNICATION
exports.deleteCommunication =
async (req, res) => {

    try {

        await Communication.findByIdAndUpdate(

            req.params.id,

            {
                deleted: true
            }

        );

        res.status(200).json({

            success: true,

            message:
                "Communication deleted"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// COMMUNICATION ANALYTICS
exports.getCommunicationStats =
async (req, res) => {

    try {

        const total =
        await Communication.countDocuments();

        const calls =
        await Communication.countDocuments({
            type: "Call"
        });

        const emails =
        await Communication.countDocuments({
            type: "Email"
        });

        const meetings =
        await Communication.countDocuments({
            type: "Meeting"
        });

        const whatsapp =
        await Communication.countDocuments({
            type: "WhatsApp"
        });

        res.status(200).json({

            success: true,

            stats: {
                total,
                calls,
                emails,
                meetings,
                whatsapp
            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};