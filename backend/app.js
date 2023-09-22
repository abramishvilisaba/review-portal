const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const session = require("express-session");

const searchRoutes = require("./routes/search");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const commentsRoutes = require("./routes/comments");
const uploadRoutes = require("./routes/upload");
const ratingRoutes = require("./routes/rating");
const likesRoutes = require("./routes/likes");
const adminRoutes = require("./routes/admin");

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
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("new-comment", (data) => {
        console.log("new-comment:", data);
    });

    socket.on("new-review", (data) => {
        console.log("new-review:", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected!");
    });
});

console.log("---------------------------------------------");

app.use("/rating", ratingRoutes);

app.use("/search", searchRoutes);

app.use("/likes", likesRoutes);

app.use("/auth", authRoutes);

app.use("/reviews", reviewRoutes(io));

app.use("/profile", profileRoutes);

app.use("/comments", commentsRoutes(io));

app.use("/upload", uploadRoutes);

app.use("/admin", adminRoutes);

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

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
