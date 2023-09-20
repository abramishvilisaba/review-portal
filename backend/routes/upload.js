require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/photo", upload.single("image"), (req, res) => {
    console.log("/photo");

    const file = req.file;
    const id = req.body.id;

    const transformOptions = {
        width: 1000,
        height: 1000,
        crop: "fill",
        format: "jpg",
        quality: "auto:low",
        public_id: id,
        resource_type: "auto",
    };

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    cloudinary.uploader
        .upload_stream(
            {
                public_id: id,
                resource_type: "auto",
                transformation: transformOptions,
                format: "jpg",
            },
            (error, result) => {
                if (error) {
                    return res.status(500).send(error);
                }
                return res.status(200).send(result.secure_url);
            }
        )
        .end(file.buffer);
});

module.exports = router;
