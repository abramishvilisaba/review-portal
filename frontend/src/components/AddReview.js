import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    TextareaAutosize,
    Slider,
    Button,
    Container,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useIntl, FormattedMessage } from "react-intl";

function AddReview({ userId, onAddReview }) {
    const intl = useIntl();

    const [reviewData, setReviewData] = useState({
        reviewName: "",
        pieceName: "",
        reviewText: "",
        creatorGrade: 1,
        tags: "",
        reviewPhoto: null,
        group: "",
    });

    const [loading, setLoading] = useState(false);

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

    const uploadPhoto = (reviewPhoto, reviewId, reviewName) => {
        try {
            const formData = new FormData();
            const id = reviewName + "/" + reviewId.toString();
            console.log(id);
            formData.append("image", reviewPhoto);
            formData.append("id", id);
            axios
                .post(`${API_URL}/upload/photo`, formData)
                .then((res) => {
                    console.log("uploaded", res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (error) {
            console.log("error uploading photo", error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const {
            reviewName,
            pieceName,
            reviewText,
            creatorGrade,
            reviewPhoto,
            tags,
            group,
        } = reviewData;

        axios
            .post(`${API_URL}/reviews`, {
                creatorId: userId,
                reviewName: reviewName,
                pieceName: pieceName,
                creatorGrade: creatorGrade,
                reviewText: reviewText,
                tags: [tags],
                group: group,
            })
            .then((response) => {
                console.log("User review stored:", response.data);
                if (reviewPhoto) {
                    uploadPhoto(
                        reviewPhoto,
                        response.data.reviewId,
                        reviewName
                    );
                }
                setTimeout(() => {
                    setReviewData({
                        reviewName: "",
                        pieceName: "",
                        reviewText: "",
                        creatorGrade: 0,
                        tags: "",
                        reviewPhoto: null,
                        group: "",
                    });
                    setLoading(false);
                    onAddReview();
                }, 6000);
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
        <Container maxWidth="lg" width="100%">
            <Box
                marginBottom={8}
                sx={{
                    p: 6,
                    boxShadow: "0px 4px 6px rgba(200, 200, 200, 0.5)",
                    borderRadius: "8px",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", mb: 6, textAlign: "start" }}
                >
                    <FormattedMessage
                        id="addNewReview"
                        defaultMessage="Add a New Review"
                    />
                </Typography>

                <form onSubmit={handleSubmit}>
                    {/* Review Name */}
                    <TextField
                        label={intl.formatMessage({
                            id: "reviewName",
                            defaultMessage: "Review Name",
                        })}
                        id="reviewName"
                        name="reviewName"
                        value={reviewData.reviewName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                    />
                    {/* Piece Name */}
                    <TextField
                        label={intl.formatMessage({
                            id: "pieceName",
                            defaultMessage: "Piece Name",
                        })}
                        id="pieceName"
                        name="pieceName"
                        value={reviewData.pieceName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                    />
                    {/* Group */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel htmlFor="group-selector">
                            <FormattedMessage
                                id="group"
                                defaultMessage="Group"
                            />
                        </InputLabel>
                        <Select
                            label={intl.formatMessage({
                                id: "group",
                                defaultMessage: "Group",
                            })}
                            value={reviewData.group}
                            onChange={handleInputChange}
                            inputProps={{
                                name: "group",
                                id: "group-selector",
                            }}
                            required
                        >
                            <MenuItem value="Movies">
                                <FormattedMessage
                                    id="moviesGroup"
                                    defaultMessage="Movies"
                                />
                            </MenuItem>
                            <MenuItem value="Books">
                                <FormattedMessage
                                    id="booksGroup"
                                    defaultMessage="Books"
                                />
                            </MenuItem>
                            <MenuItem value="Games">
                                <FormattedMessage
                                    id="gamesGroup"
                                    defaultMessage="Games"
                                />
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {/* Review Text */}
                    <TextField
                        multiline
                        label={intl.formatMessage({
                            id: "reviewText",
                            defaultMessage: "Review Text",
                        })}
                        id="reviewText"
                        name="reviewText"
                        value={reviewData.reviewText}
                        onChange={handleInputChange}
                        minRows={4}
                        style={{ width: "100%" }}
                        sx={{
                            mb: 3,
                        }}
                        required
                    />
                    {/* Creator Grade */}
                    <Box
                        alignItems="start"
                        spacing={2}
                        sx={{ mb: 1, display: "flex", flexDirection: "row" }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ pb: 2, height: "100%" }}
                        >
                            <FormattedMessage
                                id="grade"
                                defaultMessage="Grade : "
                            />
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
                            sx={{ mx: 2, mb: 0, width: "150px" }}
                        />
                        <Typography
                            variant="body1"
                            sx={{ alignSelf: "start", mt: "4px" }}
                        >
                            {reviewData.creatorGrade}
                        </Typography>
                    </Box>
                    {/* Tags */}
                    <TextField
                        label={intl.formatMessage({
                            id: "tags",
                            defaultMessage: "Tags (comma-separated)",
                        })}
                        id="tags"
                        name="tags"
                        value={reviewData.tags}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 3 }}
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
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        height: "160px",
                                    }}
                                >
                                    <Typography variant="body1" mb={2}>
                                        <FormattedMessage
                                            id="photoUpload"
                                            defaultMessage="Photo Upload"
                                        />
                                    </Typography>
                                    <input {...getInputProps()} />
                                    <CloudUploadIcon sx={{ fontSize: 32 }} />
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    {/* Submit Button */}
                    {!loading && (
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 6 }}
                        >
                            <FormattedMessage
                                id="addReview"
                                defaultMessage="Add Review"
                            />
                        </Button>
                    )}
                    {loading && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "48px",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    )}
                </form>
            </Box>
        </Container>
    );
}

export default AddReview;
