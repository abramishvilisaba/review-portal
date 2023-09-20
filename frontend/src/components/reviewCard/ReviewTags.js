import React from "react";
import { Chip, Grid } from "@mui/material";

function ReviewTags({ tags }) {
    return tags ? (
        <Grid
            container
            spacing={"2px"}
            sx={{
                display: "flex",
                mb: "4px",
            }}
        >
            {tags.map((tag, index) => (
                <Grid item key={index}>
                    <Chip
                        label={tag}
                        variant="outlined"
                        sx={{
                            height: "30px",
                            px: "0px",
                        }}
                        color="primary"
                    />
                </Grid>
            ))}
        </Grid>
    ) : null;
}

export default ReviewTags;
