const Followup = require("../model/Followup");


// CREATE FOLLOWUP
exports.createFollowup = async (req, res) => {

    try {

        const followup = await Followup.create(req.body);

        res.status(201).json({
            success: true,
            message: "Followup created",
            followup
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// GET ALL FOLLOWUPS
exports.getFollowups = async (req, res) => {

    try {

        const followups = await Followup.find();

        res.status(200).json({
            success: true,
            count: followups.length,
            followups
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// GET FOLLOWUP CATEGORIES
exports.getCategorizedFollowups = async (req, res) => {

    try {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const next7Days = new Date();

        next7Days.setDate(today.getDate() + 7);

        const all = await Followup.find();

        const categorized = {
            today: [],
            upcoming: [],
            completed: []
        };

        all.forEach((item) => {

            const followupDate = new Date(item.date);

            followupDate.setHours(0, 0, 0, 0);

            // completed
            if (item.done) {

                categorized.completed.push(item);

            }

            // today
            else if (
                followupDate.getTime() === today.getTime()
            ) {

                categorized.today.push(item);

            }

            // upcoming
            else if (
                followupDate > today &&
                followupDate <= next7Days
            ) {

                categorized.upcoming.push(item);

            }

        });

        res.status(200).json({
            success: true,
            categorized
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// MARK DONE
exports.markDone = async (req, res) => {

    try {

        const followup =
            await Followup.findByIdAndUpdate(
                req.params.id,
                {
                    done: true
                },
                {
                    returnDocument: "after"
                }
            );

        res.status(200).json({
            success: true,
            message: "Followup completed",
            followup
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// DELETE FOLLOWUP
exports.deleteFollowup = async (req, res) => {

    try {

        await Followup.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Followup deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};