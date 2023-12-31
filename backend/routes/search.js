const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const { Op, fn, col } = require("sequelize");

const { User, Review, Comment, UserReviewLikes, UserReviewRatings } = require("../models");

router.get("/", async (req, res) => {
    const { query } = req.query;
    console.log("------------search-------------");
    try {
        const reviews = await Review.findAll({
            where: {
                [Op.or]: [
                    {
                        reviewName: {
                            [Op.like]: "%" + query + "%",
                        },
                    },
                    {
                        pieceName: {
                            [Op.like]: "%" + query + "%",
                        },
                    },
                    {
                        tags: {
                            [Op.like]: "%" + query + "%",
                        },
                    },
                    {
                        reviewText: {
                            [Op.like]: "%" + query + "%",
                        },
                    },
                ],
            },
        });

        const comments = await Comment.findAll({
            where: {
                content: {
                    [Op.like]: "%" + query + "%",
                },
            },
        });
        res.json({
            reviews: reviews,
            comments: comments,
        });
    } catch (error) {
        console.error("Error searching reviews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
