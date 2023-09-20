const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const searchRoutes = require("./routes/search");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const commentsRoutes = require("./routes/comments");
const uploadRoutes = require("./routes/upload");
const ratingRoutes = require("./routes/rating");
const likesRoutes = require("./routes/likes");

const session = require("express-session");
// const passport = require("./auth/auth");

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
const allowedOrigins = ALLOWED_ORIGINS.split(",");
const jwtSecret = process.env.JWT_SECRET || "secret";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: allowedOrigins,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

console.log("---------------------------------------------");
// console.log("allowedOrigins", allowedOrigins);

app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/rating", ratingRoutes);

app.use("/search", searchRoutes);

app.use("/likes", likesRoutes);

app.use("/auth", authRoutes);

app.use("/reviews", reviewRoutes);

app.use("/profile", profileRoutes);

app.use("/comments", commentsRoutes);

app.use("/upload", uploadRoutes);

// app.get("/profile", (req, res) => {
//     console.log(req.sessionID);
//     // console.log(req.user);

//     if (req.isAuthenticated()) {
//         const displayName = req.user.displayName;
//         console.log(req.user);
//         res.send(`Welcome, ${req.user}!`);
//     } else {
//         // res.redirect("/auth/google");
//         res.status(401).json({ message: "Unauthorized" });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
