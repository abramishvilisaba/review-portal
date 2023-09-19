import React from "react";
import Button from "@mui/material/Button";

function LikeButton({ liked, onClick, stopPropagation }) {
    const handleClick = (event) => {
        if (stopPropagation) {
            event.stopPropagation();
        }
        onClick();
    };

    return (
        <Button
            variant="contained"
            onClick={handleClick}
            sx={{
                py: "1px",
                textAlign: "start",
                backgroundColor: liked ? "primary.main" : "grey.300",
                color: liked ? "#ffffff" : "grey.600",
                "&:hover": {
                    backgroundColor: liked ? "primary.dark" : "grey.400",
                },
            }}
        >
            {liked ? "Liked" : "Like"}
        </Button>
    );
}

export default LikeButton;
