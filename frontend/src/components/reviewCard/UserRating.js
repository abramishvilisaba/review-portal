import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function UserRating({ userRating, onUserRatingChange, averageRating }) {
    const stars = [1, 2, 3, 4, 5];

    // console.log(userRating);

    return (
        <Box display="flex" flexDirection={"column"} alignItems="start">
            <Box display="flex" alignItems="center">
                {stars.map((star) => (
                    <span
                        key={star}
                        style={{
                            cursor: "pointer",
                            marginRight: "4px",
                            color: star <= userRating ? "#FFD437" : "#FCF5B6",
                        }}
                        onClick={(e) => onUserRatingChange(star, e)}
                    >
                        <FontAwesomeIcon icon={faStar} size="lg" />
                    </span>
                ))}
            </Box>
        </Box>
    );
}

export default UserRating;
