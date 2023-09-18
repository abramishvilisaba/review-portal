const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const { User, Review, Comment, UserReviewLikes } = require("../models");

router.post("/like", async (req, res) => {
    const { userId, reviewId } = req.body;
    try {
        const alreadyLiked = await UserReviewLikes.findOne({
            where: { userId, reviewId },
        });
        if (alreadyLiked) {
            return res
                .status(400)
                .json({ error: "You have already liked this review." });
        }
        await UserReviewLikes.create({ userId, reviewId });
        const updatedReview = await Review.increment("likes", {
            where: { id: reviewId },
        });

        res.status(200).json({
            success: "Review has been liked.",
            review: updatedReview,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.delete("/unlike", async (req, res) => {
    const { userId, reviewId } = req.body;
    try {
        const like = await UserReviewLikes.findOne({
            where: { userId, reviewId },
        });

        if (!like) {
            return res
                .status(400)
                .json({ error: "Cannot unlike a review you have not liked." });
        }
        await UserReviewLikes.destroy({
            where: { userId, reviewId },
        });
        const updatedReview = await Review.decrement("likes", {
            where: { id: reviewId },
        });
        res.status(200).json({
            message: "You have unliked the review.",
            review: updatedReview,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
