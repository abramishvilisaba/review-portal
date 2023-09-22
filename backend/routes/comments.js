const express = require("express");
const router = express.Router();
const { User, Review, Comment } = require("../models");
const socketIo = require("socket.io");

module.exports = (io) => {
    router.post("/", async (req, res) => {
        try {
            console.log("post/");
            console.log(req.body);
            const { content, user_id, creator_name, review_id } = req.body;
            const comment = await Comment.create({
                content: content,
                userId: user_id,
                creatorName: creator_name,
                reviewId: review_id,
            });
            io.emit("new-comment", { comment });
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
                return res.status(404).json({ message: "No comments found for the review" });
            }

            res.json(comments);
        } catch (error) {
            console.error("Error retrieving comments:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

    return router;
};
// module.exports = router;
