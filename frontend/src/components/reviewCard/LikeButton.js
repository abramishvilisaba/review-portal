import React from "react";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function LikeButton({ liked, onClick, stopPropagation, version = 1 }) {
    const handleClick = (event) => {
        if (stopPropagation) {
            event.stopPropagation();
        }
        onClick();
    };

    const LikeButtonV1 = () => {
        return (
            <Button
                variant="contained"
                onClick={handleClick}
                sx={{
                    textAlign: "start",
                    padding: "6px 12px",
                    width: { xs: "95px", sm: "80px", md: "95px" },
                    borderRadius: "100px",
                    border: "1px solid #7670FC",
                    backgroundColor: liked ? "primary.main" : "primary.main",
                    color: liked ? "white" : "white",
                    "&:hover": {
                        backgroundColor: liked ? "primary.dark" : "primary.dark",
                    },
                }}
            >
                {liked ? "Liked" : "Like"}

                {liked ? (
                    <FavoriteIcon
                        sx={{
                            fontSize: "large",
                            padding: "0px",
                            width: "fit",
                            minWidth: "10px",
                            color: "white",
                            ml: "2px",
                            // fill: "red",
                        }}
                    />
                ) : (
                    <FavoriteBorderIcon
                        sx={{
                            fontSize: "large",
                            padding: "0px",
                            width: "fit",
                            minWidth: "10px",
                            color: "white",
                            ml: "2px",
                            // fill: "red",
                        }}
                    />
                )}
            </Button>
        );
    };

    const LikeButtonV2 = () => {
        return (
            <Button
                variant="contained"
                onClick={handleClick}
                sx={{
                    textAlign: "center",
                    padding: "10px",
                    // width: { xs: "95px", sm: "80px", md: "95px" },
                    width: "fit",
                    borderRadius: "100px",
                    minWidth: "30px",
                    backgroundColor: liked ? "primary" : "primary",
                    "&:hover": {
                        backgroundColor: liked ? "primary.dark" : "primary.dark",
                    },
                }}
            >
                {liked ? (
                    <FavoriteIcon
                        sx={{
                            fontSize: "xl",
                            padding: "0px",
                            width: "fit",
                            minWidth: "10px",
                            color: "white",
                            // fill: "red",
                        }}
                    />
                ) : (
                    <FavoriteBorderIcon
                        sx={{
                            fontSize: "xl",
                            padding: "0px",
                            width: "fit",
                            minWidth: "10px",
                            color: "white",
                            // fill: "red",
                        }}
                    />
                )}
            </Button>
        );
    };

    return version === 1 ? <LikeButtonV1 /> : <LikeButtonV2 />;
}

export default LikeButton;
