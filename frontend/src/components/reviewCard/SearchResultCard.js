import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Grid, Typography, Box } from "@mui/material";

function SearchResultCard({ user, review }) {
    const url = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${review.reviewName}/${review.id}.jpg`;
    const alturl = "https://res.cloudinary.com/dp30nyp5m/image/upload/v1695340392/review2.jpg";
    const [imageSrc, setImageSrc] = useState(url);
    const handleImageError = () => {
        setImageSrc(alturl);
    };
    console.log("search review", review);
    console.log("search user", user);

    return (
        <Card
            sx={{
                display: "flex",
                borderRadius: "20px",
                border: "1px solid #E8E8E8",
                // p: "10px",
                mb: "10px",
            }}
        >
            <CardMedia
                component="img"
                height="150"
                src={imageSrc}
                alt={"Review Image"}
                onError={handleImageError}
                sx={{
                    flex: "0 0 150px",
                    minWidth: "150px",
                }}
            />
            <CardContent sx={{ flex: "1" }}>
                <Typography variant="h6" color="text.primary">
                    <Link to={`/reviews/${review.id}`} state={{ review: review, user: user }}>
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
