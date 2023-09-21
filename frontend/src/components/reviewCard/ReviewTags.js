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
            {tags.map((tag, index) =>
                tag ? (
                    <Grid item key={index}>
                        <Chip
                            label={tag}
                            variant="outlined"
                            sx={{
                                height: "35px",
                                px: "0px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            color="secondary"
                            // color="#DFA18A"
                        />
                    </Grid>
                ) : null
            )}
        </Grid>
    ) : null;
}

export default ReviewTags;
