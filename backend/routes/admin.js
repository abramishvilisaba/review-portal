const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const jwt = require("jsonwebtoken");
const { User, Review, Comment, UserReviewLikes } = require("../models");

const adminPassword = process.env.ADMIN_PASSWORD;
const secretKey = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === adminPassword) {
        const adminToken = jwt.sign({ username: "admin" }, secretKey, {
            expiresIn: "4h",
        });

        res.status(200).json({ adminToken });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;
