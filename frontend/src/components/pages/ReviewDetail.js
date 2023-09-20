import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Container,
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";

import ReviewCard from "../reviewCard/ReviewCard";

const ReviewDetail = ({}) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);

    console.log("content", content);

    let { state } = useLocation();
    const { review, user } = state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.length > 0) {
            try {
                console.log(content);
                console.log(review.id);
                const response = await axios.post(`${API_URL}/comments`, {
                    content,
                    user_id: user.id,
                    review_id: review.id,
                });
                setContent("");
                loadComments();
            } catch (error) {
                console.error("Error creating comment:", error);
            }
        }
    };

    const loadComments = () => {
        axios
            .get(`${API_URL}/comments/${review.id}`)
            .then((response) => {
                console.log(response.data);
                setComments(response.data);
            })
            .catch((error) => console.log("error", error));
    };

    useEffect(() => {
        loadComments();
    }, []);

    return (
        <Container
            sx={{
                // width: 2 / 3,
                width: { xs: "100%", md: "70%" },
                bgcolor: "rgba(255, 255, 255, 0.09)",
                pt: "10px",
                pb: "48px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 8,
                }}
            >
                <Box sx={{ width: "2/3" }}>
                    <ReviewCard
                        review={review}
                        user={user}
                        size={400}
                        reviewDetail={true}
                    />
                </Box>
                {user && (
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                        }}
                    >
                        <TextField
                            multiline
                            variant="outlined"
                            placeholder="Add a comment..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            fullWidth
                            sx={{ maxWidth: "100%", width: "100%" }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ my: "20px" }}
                        >
                            Add Comment
                        </Button>
                    </form>
                )}
                <Box
                    sx={{
                        width: 2 / 3,
                        maxWidth: "500px",
                        border: "",
                    }}
                >
                    {comments.map((comment) => {
                        return (
                            <Box key={comment.id} width={1}>
                                <Typography
                                    align="start"
                                    variant="h6"
                                    px={2}
                                    py={1}
                                    sx={{
                                        border: "1px solid gray",
                                        borderRadius: "10px",
                                    }}
                                >
                                    {comment.CommentCreator.displayName}
                                    {" : "}
                                    {comment.content}
                                </Typography>
                                {/* <Typography align="center">
                                    {comment.content}
                                </Typography> */}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Container>
    );
};

export default ReviewDetail;
