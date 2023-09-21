const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User, Review, Comment, UserReviewRatings } = require("../models");

router.get("/", (req, res) => {
    console.log("profile");
    const userInfo = req.user;
    res.json(userInfo);
});

async function getReviewsByCreator(creatorId) {
    try {
        console.log("getReviewsByCreator");
        const reviews = await Review.findAll({
            where: {
                creatorId: creatorId,
            },
            order: [["createdAt", "DESC"]],
        });

        return reviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
}

router.get("/:creatorId", async (req, res) => {
    console.log("/:creatorId");
    const creatorId = req.params.creatorId;
    const recentlyAddedReviews = await Review.findAll({
        where: {
            creatorId: creatorId,
        },
        order: [["createdAt", "DESC"]],
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
    res.status(200).json(recentlyAddedReviews);

    // getReviewsByCreator(req.params.creatorId)
    //     .then((reviews) => {
    //         res.status(200).json(reviews);
    //     })
    //     .catch((error) => {
    //         console.error("Error:", error);

    //         res.status(500).json({
    //             error: "An error occurred while loading reviews.",
    //         });
    //     });
});

module.exports = router;
