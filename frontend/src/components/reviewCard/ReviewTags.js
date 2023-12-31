import React from "react";
import { Chip, Grid } from "@mui/material";

function ReviewTags({ tags, handleTagClick }) {
    return tags ? (
        <Grid
            container
            spacing={"2px"}
            sx={{
                display: "flex",
            }}
        >
            {tags.map((tag, index) =>
                tag ? (
                    <Grid item key={index}>
                        <Chip
                            label={tag}
                            variant="outlined"
                            sx={{
                                height: "34px",
                                px: "0px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            color="secondary"
                            // color="#DFA18A"
                            onClick={() => handleTagClick(tag)}
                        />
                    </Grid>
                ) : null
            )}
        </Grid>
    ) : null;
}

export default ReviewTags;
