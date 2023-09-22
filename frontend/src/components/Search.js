import React, { useState } from "react";
import axios from "axios";
import { Input, Box, Button } from "@mui/material";
import { IntlProvider, FormattedMessage, FilteredMessage } from "react-intl";

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
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disableUnderline
                sx={{
                    marginRight: "8px",
                    borderRadius: "100px",
                    border: "1px solid #A7A7A7",
                    px: 2,
                    py: 1,
                }}
            />
            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                    height: "100%",
                    borderRadius: "100px",
                    border: "1px none ##7670FC",
                    px: 3,
                    py: "10px",
                }}
            >
                <FormattedMessage id="search" defaultMessage="Search" />
            </Button>
        </Box>
    );
}

export default Search;
