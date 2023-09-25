const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const jwt = require("jsonwebtoken");
const { User, Review, Comment, UserReviewLikes } = require("../models");

const adminPassword = process.env.ADMIN_PASSWORD;
const secretKey = process.env.JWT_SECRET;
const jwtSecret = process.env.JWT_SECRET || "secret";

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

router.get("/users", async (req, res) => {
    try {
        console.log("/admin/users");
        const authHeader = req.headers.authorization;
        const token = authHeader.slice(7);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, jwtSecret);
        console.log(decoded);

        if (!decoded.username || decoded.username !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const users = await User.findAll({ limit: 100 });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "An error occurred while fetching user data." });
    }
});

module.exports = router;
