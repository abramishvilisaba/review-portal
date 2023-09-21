import React from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Box,
} from "@mui/material";

function SearchResultCard({ review }) {
    const url = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${review.reviewName}/${review.id}.jpg`;

    return (
        <Card
            sx={{
                display: "flex",
                borderRadius: "20px",
                border: "1px solid #E8E8E8",
                p: "10px",
                mb: "10px",
            }}
        >
            <CardMedia
                component="img"
                height="150"
                image={url}
                alt="Review Image"
                sx={{
                    flex: "0 0 150px",
                    minWidth: "150px",
                }}
            />
            <CardContent sx={{ flex: "1" }}>
                <Typography variant="h6" color="text.primary">
                    <Link to={`/reviews/${review.id}`}>
                        {review.reviewName}
                    </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {review.pieceName} - {review.group}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default SearchResultCard;
