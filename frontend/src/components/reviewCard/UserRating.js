import React, { useState } from "react";
import { Typography, Box, Grid, Rating } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function UserRating({ userRating, onUserRatingChange, averageRating, user = true }) {
    const stars = [1, 2, 3, 4, 5];
    const [value, setValue] = useState(userRating);

    return (
        <Box display="flex" flexDirection={"column"} alignItems="start">
            <Box display="flex" alignItems="center">
                {/* {stars.map((star) => (
                    <span
                        key={star}
                        style={{
                            cursor: "pointer",
                            marginRight: "2px",
                            color: star <= userRating ? "#FFD437" : "#FCF5B6",
                        }}
                        onClick={(e) => onUserRatingChange(star, e)}
                    >
                        <FontAwesomeIcon icon={faStar} size="sm" />
                    </span>
                ))} */}
                {user ? (
                    <Rating
                        name={"half-rating"}
                        // defaultValue={averageRating}
                        defaultValue={averageRating}
                        size="medium"
                        precision={1}
                        value={userRating}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                            console.log("value = ", newValue);
                            onUserRatingChange(newValue, event);
                        }}
                    />
                ) : (
                    <Rating
                        name={"half-rating"}
                        readOnly
                        // defaultValue={averageRating}
                        defaultValue={averageRating}
                        size="medium"
                        precision={0.1}
                        value={averageRating}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                            console.log("value = ", newValue);
                            onUserRatingChange(newValue, event);
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}

export default UserRating;
