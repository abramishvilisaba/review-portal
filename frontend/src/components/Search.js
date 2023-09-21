import React, { useState } from "react";
import axios from "axios";
import { Input, Box, Button } from "@mui/material";

function Search({ updateResults }) {
    const [query, setQuery] = useState("");
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const handleSearch = async () => {
        try {
            if (query.length > 1) {
                const response = await axios.get(`${API_URL}/search`, {
                    params: { query },
                });
                console.log("data", response.data);
                updateResults(response.data);
            } else if (query.length === 0) {
                updateResults([]);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <Box
            width={"100%"}
            sx={{
                display: "flex",
                alignContent: "space-between",
                alignItems: "baseline",
                marginBottom: "0px",
            }}
        >
            <Input
                placeholder="Search reviews..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ marginRight: "8px" }}
            />
            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ height: "100%" }}
            >
                Search
            </Button>
        </Box>
    );
}

export default Search;
