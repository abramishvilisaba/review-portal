import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    TextareaAutosize,
    Slider,
    Button,
    Container,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UserRating from "./reviewCard/UserRating";
import axios from "axios";
import Dropzone from "react-dropzone";
import UseTheme from "../UseTheme";

function AddReview({ userId, onAddReview }) {
    const [reviewData, setReviewData] = useState({
        reviewName: "",
        pieceName: "",
        reviewText: "",
        creatorGrade: 0,
        tags: "",
        reviewPhoto: null,
    });
    const API_URL = process.env.REACT_APP_API_URL;

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setReviewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUserRatingChange = (newRating) => {
        setReviewData((prevData) => ({
            ...prevData,
            userRating: newRating,
        }));
    };

    const uploadPhoto = (reviewPhoto, reviewId) => {
        const formData = new FormData();
        formData.append("image", reviewPhoto);
        formData.append("reviewId", reviewId);

        axios
            .post(`${API_URL}/upload/photo`, formData)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const {
            reviewName,
            pieceName,
            reviewText,
            creatorGrade,
            reviewPhoto,
            tags,
        } = reviewData;
        axios
            .post(`${API_URL}/reviews`, {
                creatorId: userId,
                reviewName: reviewName,
                pieceName: pieceName,
                creatorGrade: creatorGrade,
                reviewText: reviewText,
                tags: [tags],
            })
            .then((response) => {
                console.log("User review stored:", response.data);
                setReviewData({
                    reviewName: "",
                    pieceName: "",
                    reviewText: "",
                    creatorGrade: 0,
                    tags: "",
                    reviewPhoto: null,
                });
                onAddReview();
                if (reviewPhoto) {
                    uploadPhoto(reviewPhoto, response.data.reviewId);
                }
            })
            .catch((error) => {
                console.error("Error storing user review:", error);
            });
    };

    const handleDrop = (acceptedFiles) => {
        setReviewData((prevData) => ({
            ...prevData,
            reviewPhoto: acceptedFiles[0],
        }));
    };

    return (
        <Container maxWidth="md" width="100px">
            <Box
                marginBottom={8}
                sx={{
                    p: 6,
                    boxShadow: "0px 4px 6px rgba(200, 200, 200, 0.5)",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4 }}>
                    Add a New Review
                </Typography>
                <form onSubmit={handleSubmit}>
                    {/* Review Name */}
                    <TextField
                        label="Review Name"
                        id="reviewName"
                        name="reviewName"
                        value={reviewData.reviewName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 4 }}
                    />
                    {/* Piece Name */}
                    <TextField
                        label="Piece Name"
                        id="pieceName"
                        name="pieceName"
                        value={reviewData.pieceName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 4 }}
                    />
                    {/* Review Text */}
                    <TextField
                        multiline
                        label="Review Text"
                        id="reviewText"
                        name="reviewText"
                        placeholder="Review Text"
                        value={reviewData.reviewText}
                        onChange={handleInputChange}
                        minRows={4}
                        style={{ width: "100%" }}
                        sx={{
                            mb: 4,
                        }}
                        required
                    />
                    {/* Creator Grade */}
                    <div className="mb-4 flex flex-row">
                        <Typography variant="subtitle1" sx={{ pb: 2 }}>
                            Grade:
                        </Typography>
                        <Slider
                            id="creatorGrade"
                            name="creatorGrade"
                            min={1}
                            max={10}
                            step={1}
                            value={reviewData.creatorGrade}
                            onChange={(_, newValue) =>
                                handleInputChange({
                                    target: {
                                        name: "creatorGrade",
                                        value: newValue,
                                    },
                                })
                            }
                            sx={{ mx: 2, mb: 4, width: "100px" }}
                        />
                        <Typography
                            variant="body1"
                            sx={{ alignSelf: "center" }}
                        >
                            {reviewData.creatorGrade}
                        </Typography>
                    </div>
                    {/* Tags */}
                    <TextField
                        label="Tags (comma-separated)"
                        id="tags"
                        name="tags"
                        value={reviewData.tags}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 4 }}
                    />
                    {/* Dropzone */}
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div
                                    {...getRootProps()}
                                    style={{
                                        border: "2px dashed #999999",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        height: "80px",
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <CloudUploadIcon sx={{ fontSize: 32 }} />
                                    {/* <Typography variant="body1">
                                        Drag 'n' drop some files here, or click
                                        to select files
                                    </Typography> */}
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    {/* Submit Button */}
                    <Button type="submit" variant="contained" sx={{ mt: 4 }}>
                        Add Review
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default AddReview;
