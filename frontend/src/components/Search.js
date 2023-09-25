import React, { useState } from "react";
import axios from "axios";
import { Input, TextField, Box, Button } from "@mui/material";
import { IntlProvider, FormattedMessage, FilteredMessage } from "react-intl";

function Search({ updateResults, searchTag }) {
    const [query, setQuery] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;

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

    const searchPlaceholder = <FormattedMessage id="search" defaultMessage="Search" />;

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
            {/* <Input
                // placeholder={<FormattedMessage id="search" defaultMessage="Search" />}
                // placeholder={searchPlaceholder}
                label={searchPlaceholder}
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
            /> */}
            <TextField
                id="outlined-search"
                label={<FormattedMessage id="searchBox" defaultMessage="Search" />}
                value={query}
                sx={{
                    marginRight: "8px",
                    width: { xs: "80%", lg: "60%" },
                }}
                InputProps={{
                    style: {
                        paddingLeft: "10px",
                        height: "50px",
                        borderRadius: 50,
                        textAlign: "center",
                    },
                }}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
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
