const express = require("express");
const router = express.Router();
const { User, Review, Comment } = require("../models");

router.post("/", async (req, res) => {
    try {
        console.log("post/");
        console.log(req.body);
        const { content, user_id, review_id } = req.body;
        const comment = await Comment.create({
            content: content,
            userId: user_id,
            reviewId: review_id,
        });
        res.status(201).json({ comment });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:reviewId", async (req, res) => {
    try {
        console.log("/comments");
        const reviewId = req.params.reviewId;
        const comments = await Comment.findAll({
            where: { reviewId: reviewId },
            include: [
                {
                    model: User,
                    as: "CommentCreator",
                    attributes: ["profileId", "displayName"],
                },
            ],
        });

        if (!comments || comments.length === 0) {
            return res
                .status(404)
                .json({ message: "No comments found for the review" });
        }

        res.json(comments);
        // const comments = await Comment.findAll({
        //     where: { reviewId: reviewId },
        //     include: [
        //         {
        //             model: User,
        //             as: "CommentCreator",
        //             attributes: ["profileId", "displayName"],
        //         },
        //     ],
        // });

        // if (!comments) {
        //     return res
        //         .status(404)
        //         .json({ message: "No comments found for the review" });
        // }
        // console.log(comments);

        // res.json(comments);
    } catch (error) {
        console.error("Error retrieving comments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;
