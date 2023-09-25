const express = require("express");
const { UserReviewRatings } = require("../models");
const router = express.Router();

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    console.log("/:id");

    try {
        const ratingToUpdate = await UserReviewRatings.findByPk(id);

        if (ratingToUpdate) {
            await ratingToUpdate.update({ rating });

            res.json(ratingToUpdate);
        } else {
            res.status(404).json({ error: "Rating not found" });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    console.log("post rating");

    const { userId, reviewId, rating } = req.body;

    try {
        const existingRating = await UserReviewRatings.findOne({
            where: { userId, reviewId },
        });

        if (existingRating) {
            await existingRating.update({ rating });
            res.json(existingRating);
        } else {
            const newRating = await UserReviewRatings.create({
                userId,
                reviewId,
                rating,
            });
            res.json(newRating);
        }
    } catch (error) {
        console.log("==================================================================");
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
