const express = require("express");
const router = express.Router();
// const { Review } = require("../models");
const { User, Review, Comment } = require("../models");

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
    getReviewsByCreator(req.params.creatorId)
        .then((reviews) => {
            res.status(200).json(reviews);
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({
                error: "An error occurred while loading reviews.",
            });
        });
});

module.exports = router;
