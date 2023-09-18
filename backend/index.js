// const express = require("express");
// const cors = require("cors");
// const app = express();
// const db = require("./models");
// const PORT = process.env.PORT || 3001;
// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
// const allowedOrigins = ALLOWED_ORIGINS.split(",");

// app.use(express.json());

// app.use(
//     cors({
//         origin: (origin, callback) => {
//             if (allowedOrigins.includes(origin) || !origin) {
//                 callback(null, true);
//             } else {
//                 callback(new Error("Not allowed by CORS"));
//             }
//         },
//     })
// );

// (async () => {
//     await db.sequelize.sync();
// })();

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
