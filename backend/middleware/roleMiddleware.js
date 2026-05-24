exports.adminOnly =
(req, res, next) => {

    if (
        req.user.role !== "Admin"
    ) {

        return res.status(403).json({

            success: false,

            message:
                "Admin access only"

        });

    }

    next();

};




exports.bdaOrAdmin =
(req, res, next) => {

    if (

        req.user.role !==
            "Admin"

        &&

        req.user.role !==
            "BDA Employee"

    ) {

        return res.status(403).json({

            success: false,

            message:
                "Access denied"

        });

    }

    next();

};