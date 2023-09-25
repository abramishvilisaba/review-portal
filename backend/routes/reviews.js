const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Sequelize } = require("sequelize");
const db = require("../db/connection");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const { User, Review, Comment, UserReviewLikes, UserReviewRatings } = require("../models");

const jwtSecret = process.env.JWT_SECRET || "secret";

module.exports = (io) => {
    router.post("/", async (req, res) => {
        try {
            console.log("post reviews");
            const { creatorId, creatorGrade, reviewText, reviewName, pieceName, group, tags } =
                req.body.reviewData;
            console.log(creatorId, creatorGrade, reviewText, reviewName, pieceName, group, tags);
            const createdReview = await Review.create({
                creatorId: creatorId,
                reviewName: reviewName,
                pieceName: pieceName,
                group: group,
                reviewText: reviewText,
                creatorGrade: creatorGrade,
                tags: [tags],
            });
            function emitNew() {
                io.emit("new-review");
            }
            setTimeout(emitNew, 5000);

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

    router.put("/:reviewId", async (req, res) => {
        try {
            console.log("put/:reviewId");

            const reviewId = req.params.reviewId;
            const { reviewName, pieceName, group, reviewText, creatorGrade, tags } =
                req.body.reviewData;
            const existingReview = await Review.findByPk(reviewId);
            if (!existingReview) {
                return res.status(404).json({ message: "Review not found" });
            }

            existingReview.reviewName = reviewName;
            existingReview.pieceName = pieceName;
            existingReview.group = group;
            existingReview.reviewText = reviewText;
            existingReview.creatorGrade = creatorGrade;
            existingReview.tags = [tags];

            await existingReview.save();

            function emitNew() {
                io.emit("new-review");
            }
            setTimeout(emitNew, 5000);

            res.status(200).json({ message: "Review updated successfully" });
        } catch (error) {
            console.log("Error updating review:", error);
            res.status(500).json({
                error: "An error occurred while updating the review.",
            });
        }
    });

    router.get("/recentlyAdded", async (req, res) => {
        try {
            console.log("recentlyAdded---------------------------");
            const recentlyAddedReviews = await Review.findAll({
                order: [["createdAt", "DESC"]],
                limit: 40,
            });

            const ratingPromises = recentlyAddedReviews.map(async (review) => {
                const ratings = await UserReviewRatings.findAll({
                    where: { reviewId: review.id },
                });
                if (ratings.length > 0) {
                    const totalRating = _.sumBy(ratings, "rating");
                    review.dataValues.averageRating = (totalRating / ratings.length).toFixed(1);
                } else {
                    review.dataValues.averageRating = 0;
                }
            });

            await Promise.all(ratingPromises);
            res.status(200).json(recentlyAddedReviews);
        } catch (error) {
            console.error("Error loading recently added reviews:", error);
            res.status(500).json({
                error: "An error occurred while loading recently added reviews.",
            });
        }
    });

    router.delete("/delete/:id", async (req, res) => {
        console.log("/reviews/:id");
        try {
            const reviewId = req.params.id;
            const authHeader = req.headers.authorization;
            const token = authHeader.slice(7);
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const decoded = jwt.verify(token, jwtSecret);

            console.log("delete================");

            const review = await Review.findByPk(reviewId);

            if (!review) {
                return res.status(404).json({ message: "Review not found." });
            }

            if (review.creatorId !== decoded.id && decoded.username !== "admin") {
                return res.status(401).json({ message: "Unauthorized" });
            }

            await Comment.destroy({ where: { reviewId } });
            await UserReviewLikes.destroy({ where: { reviewId } });
            await UserReviewRatings.destroy({ where: { reviewId } });

            await review.destroy();
            io.emit("new-review", {});
            return res.status(204).send();
        } catch (error) {
            console.error("Error deleting review:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    return router;
};
