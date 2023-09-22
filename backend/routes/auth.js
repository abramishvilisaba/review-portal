const express = require("express");
const googlePassport = require("../auth/googleAuth");
const githubPassport = require("../auth/githubAuth");
const facebookPassport = require("../auth/facebookAuth");

const crypto = require("crypto");
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
// const { User } = require("../models");
const { User, Review, Comment, UserReviewLikes, UserReviewRatings } = require("../models");

const router = express.Router();

const secretKey = "secret-key";
const jwtSecret = process.env.JWT_SECRET || "secret";

function generateIdFromEmail(email) {
    const hash = crypto
        .createHash("sha256")
        .update(email.toLowerCase() + secretKey)
        .digest("hex");
    console.log("hashhh");
    console.log(parseInt(hash, 14));
    const numericId = parseInt(hash.substring(0, 12), 16);
    console.log(numericId);
    return numericId;
}

async function createUser(newUser) {
    try {
        await User.create(newUser);
        console.log("User created:", newUser);
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

router.get(
    "/google",
    googlePassport.authenticate("google", {
        scope: ["openid", "profile", "email"],
    })
);

router.get("/github", githubPassport.authenticate("github", { scope: ["user:email"] }));

// router.get(
//     "/facebook",
//     facebookPassport.authenticate("facebook", { scope: ["user:email"] })
// );

// router.get(
//     "/facebook/callback",
//     githubPassport.authenticate("github", {
//         successRedirect: "/dashboard",
//         failureRedirect: "/login",
//     }),
//     async (req, res) => {
//         try {
//             console.log(req);
//         } catch (error) {
//             console.log(error);
//         }
//     }
// );

router.get(
    "/github/callback",
    githubPassport.authenticate("github", {
        failureRedirect: "/login",
    }),
    async (req, res) => {
        try {
            const newUser = {
                displayName: res.req.user.displayName,
                profileId: res.req.user.id,
            };
            console.log("newUser", newUser);
            const existingUser = await User.findOne({
                where: { profileId: newUser.profileId },
            });
            console.log("existingUser", existingUser);
            if (existingUser) {
                const userId = existingUser.id;
                newUser.id = userId;
            } else if (!existingUser) {
                const createdUser = await User.create(newUser);
                const userId = createdUser.id;
                newUser.id = userId;
            }
            console.log("newUser", newUser);
            const jwtToken = jwt.sign(newUser, jwtSecret, { expiresIn: "4h" });
            res.cookie("jwtToken", jwtToken, {
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 4,
            });
            const encodedJwtToken = encodeURIComponent(jwtToken);

            res.redirect(
                `${ALLOWED_ORIGINS}/dashboard/?message=Login%20successful&jwtToken=${encodedJwtToken}`
            );
            // res.redirect(`${ALLOWED_ORIGINS}`);
        } catch (error) {
            console.log("logging in error: ", error);
        }
    }
);

router.get(
    "/google/callback",
    googlePassport.authenticate("google", { failureRedirect: "/" }),
    async (req, res) => {
        try {
            const newUser = {
                displayName: res.req.user.displayName,
                profileId: res.req.user.id,
            };
            console.log("newUser", newUser);
            const existingUser = await User.findOne({
                where: { profileId: newUser.profileId },
            });
            console.log("existingUser", existingUser);
            if (existingUser) {
                const userId = existingUser.id;
                newUser.id = userId;
            } else if (!existingUser) {
                const createdUser = await User.create(newUser);
                const userId = createdUser.id;
                newUser.id = userId;
            }
            console.log("newUser", newUser);
            const jwtToken = jwt.sign(newUser, jwtSecret, { expiresIn: "4h" });
            res.cookie("jwtToken", jwtToken, {
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 4,
            });
            const encodedJwtToken = encodeURIComponent(jwtToken);

            res.redirect(
                `${ALLOWED_ORIGINS}/dashboard/?message=Login%20successful&jwtToken=${encodedJwtToken}`
            );
            // res.redirect(`${ALLOWED_ORIGINS}`);
        } catch (error) {
            console.log("logging in error: ", error);
        }
    }
);

// router.get("/getuserdata", (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         const token = authHeader.slice(7);
//         if (!token) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }
//         const decoded = jwt.verify(token, jwtSecret);
//         res.status(200).json({
//             userName: decoded.displayName,
//             userEmail: decoded.email,
//             userId: decoded.id,
//         });
//     } catch (error) {
//         console.error("JWT verification error:", error);
//         res.status(401).json({ message: "Unauthorized" });
//     }
// });

router.get("/getuserdata", async (req, res) => {
    try {
        console.log("/getuserdata");
        const authHeader = req.headers.authorization;
        const token = authHeader.slice(7);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.id;

        // const likedReviews = await UserReviewLikes.findAll({
        //     where: { userId },
        //     include: [
        //         {
        //             model: Review,
        //             attributes: ["id", "title", "content"],
        //         },
        //     ],
        // });

        const likedReviews = await UserReviewLikes.findAll({
            where: { userId },
            attributes: ["reviewId"],
        });

        const ratedReviews = await UserReviewRatings.findAll({
            where: { userId },
            attributes: ["reviewId", "rating"],
        });

        ratedReviews.forEach((element, i) => {
            console.log("--------------------------------------------------");
        });

        // likedReviews.forEach((element, i) => {
        //     console.log("--------------------------------------------------");
        //     console.log("i= ", i);
        //     console.log(element.dataValues.reviewId);
        // });

        res.status(200).json({
            userName: decoded.displayName,
            userEmail: decoded.email,
            userId: decoded.id,
            likedReviews: likedReviews.map((review) => review.dataValues.reviewId),
            ratedReviews: ratedReviews.map((rating) => ({
                reviewId: rating.dataValues.reviewId,
                rating: rating.dataValues.rating,
            })),
        });
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
});

router.post("/logout", (req, res) => {
    console.log("logout");
    res.cookie("jwtToken", "", { expires: new Date(0), httpOnly: false });
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;

// router.get("/login/success", async (req, res) => {
//     console.log("login", req.body);
//     if (req.user) {
//         console.log("/login/success", req.user);
//         const newUser = {
//             id: generateIdFromEmail(req.user.id),
//             displayName: req.user.displayName,
//             email: req.user.email,
//         };
//         try {
//             await createUser(newUser);
//             res.status(200).json({
//                 success: true,
//                 message: "Successful",
//                 user: newUser,
//             });
//         } catch (error) {
//             console.error("Error creating user:", error);
//             res.status(500).json({
//                 success: false,
//                 message: "Error creating user",
//             });
//         }
//     } else {
//         res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//         });
//     }
// });
