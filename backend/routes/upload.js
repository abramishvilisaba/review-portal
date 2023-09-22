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

router.post("/photo", upload.single("image"), async (req, res) => {
    console.log("/photo");

    const file = req.file;
    const id = req.body.id;

    try {
        await cloudinary.uploader.destroy(id, { invalidate: true });
    } catch (deleteError) {
        console.error("Error deleting existing image:", deleteError);
    }

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

// router.post("/rename-image", async (req, res) => {
//     try {
//         const { oldPublicId, newPublicId } = req.body;

//         cloudinary.uploader.rename(oldPublicId, newPublicId, (error, result) => {
//             if (error) {
//                 console.error("Error renaming image:", error);
//                 res.status(500).json({ error: "Error renaming image" });
//             } else {
//                 console.log("Image renamed successfully:", result);
//                 res.status(200).json({ message: "Image renamed successfully" });
//             }
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

module.exports = router;
