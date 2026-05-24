const jwt =
require("jsonwebtoken");

const User =
require("../model/User");

exports.protect =
async (req, res, next) => {

    try {

        let token;

        // CHECK TOKEN
        if (

            req.headers.authorization &&

            req.headers.authorization.startsWith(
                "Bearer"
            )

        ) {

            token =
            req.headers.authorization.split(
                " "
            )[1];

        }

        // NO TOKEN
        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Not authorized"

            });

        }

        // VERIFY TOKEN
        const decoded =
        jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        // FIND USER
        const user =
        await User.findById(
            decoded.id
        ).select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "User not found"

            });

        }

        // STORE USER
        req.user = user;

        next();

    } catch (error) {

        res.status(401).json({

            success: false,

            message:
                "Invalid token"

        });

    }

};