const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Sequelize } = require("sequelize");
const db = require("../db/connection");
const {
    User,
    Review,
    Comment,
    UserReviewLikes,
    UserReviewRatings,
} = require("../models");

router.post("/", async (req, res) => {
    try {
        console.log("post reviews");
        const {
            creatorId,
            creatorGrade,
            reviewText,
            reviewName,
            pieceName,
            group,
            tags,
        } = req.body;
        console.log("--------------------------------------");
        console.log(req.body);
        const createdReview = await Review.create({
            creatorId: creatorId,
            reviewName: reviewName,
            pieceName: pieceName,
            group: group,
            reviewText: reviewText,
            creatorGrade: creatorGrade,
            tags: tags,
        });
        console.log("createdReview", createdReview);
        res.status(200).json({
            message: "User review stored successfully.",
            reviewId: createdReview.id,
        });
    } catch (error) {
        console.error("Error storing user review:", error);
        res.status(500).json({
            error: "An error occurred while storing user review.",
        });
    }
});

router.get("/recentlyAdded", async (req, res) => {
    try {
        console.log("recentlyAdded---------------------------");
        const recentlyAddedReviews = await Review.findAll({
            order: [["createdAt", "DESC"]],
            limit: 10,
        });

        const ratingPromises = recentlyAddedReviews.map(async (review) => {
            const ratings = await UserReviewRatings.findAll({
                where: { reviewId: review.id },
            });
            if (ratings.length > 0) {
                const totalRating = _.sumBy(ratings, "rating");
                review.dataValues.averageRating = (
                    totalRating / ratings.length
                ).toFixed(1);
            } else {
                review.dataValues.averageRating = 0;
            }
        });

        await Promise.all(ratingPromises);
        console.log("----------------------------------------------");
        // console.log(recentlyAddedReviews);

        res.status(200).json(recentlyAddedReviews);
    } catch (error) {
        console.error("Error loading recently added reviews:", error);
        res.status(500).json({
            error: "An error occurred while loading recently added reviews.",
        });
    }
});

// router.get("/recentlyAdded", async (req, res) => {
//     try {
//         console.log("recentlyAdded---------------------------");
//         const recentlyAddedReviews = await Review.findAll({
//             order: [["createdAt", "DESC"]],
//             limit: 10,
//             include: [
//                 {
//                     model: UserReviewRatings,
//                     as: "Ratings",
//                     attributes: [
//                         [
//                             Sequelize.fn(
//                                 "AVG",
//                                 Sequelize.col("Ratings.rating")
//                             ),
//                             "averageRating",
//                         ],
//                     ],
//                 },
//             ],
//         });
//         res.status(200).json(recentlyAddedReviews);
//     } catch (error) {
//         console.error("Error loading recently added reviews:", error);
//         res.status(500).json({
//             error: "An error occurred while loading recently added reviews.",
//         });
//     }
// });

module.exports = router;
