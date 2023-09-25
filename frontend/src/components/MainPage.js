import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import _ from "lodash";
import Cookies from "js-cookie";
import UseTheme from "../UseTheme";
import io from "socket.io-client";
import { IntlProvider, FormattedMessage } from "react-intl";
import {
    Button,
    Grid,
    Typography,
    Container,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
    TextField,
    CircularProgress,
} from "@mui/material";
import messages from "../messages";
import ReviewCard from "./reviewCard/ReviewCard";
import SearchResultCard from "./reviewCard/SearchResultCard";
import AddReview from "./AddReview";
import { getReviews, getReviewsWithRetry } from "../services/reviewService";
import { getUserData, logOut } from "../services/userService";

function MainPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [topReviews, setTopReviews] = useState([]);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState("");
    const location = useLocation();
    const [searchResults, setSearchResults] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    useEffect(() => {
        if (reviews.length === 0) {
            initializeApp();
        }
    }, []);

    useEffect(() => {
        const socket = io(API_URL);
        socket.on("new-review", () => fetchAndSetReviews());
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        setRecentAndTopReviews();
    }, [reviews]);

    const initializeApp = () => {
        console.log("initializeApp");

        setToken();
        setSearchResults([]);
        setShowAddForm(false);
        fetchAndSetUsers();
        fetchAndSetReviews();
    };

    const setToken = () => {
        const searchParams = new URLSearchParams(location.search);
        const jwtToken = searchParams.get("jwtToken");
        if (jwtToken) {
            Cookies.set("jwtToken", jwtToken, { expires: 60 * 60 * 4 });
        }
    };

    const fetchAndSetReviews = async () => {
        console.log("fetchAndSetReviews");
        try {
            const reviewData = await getReviews();
            setReviews(reviewData);
        } catch (error) {
            console.error("Error loading recently added reviews:", error);
        }
    };

    const fetchAndSetUsers = () => {
        console.log("fetchAndSetUsers");
        getUserData()
            .then((userData) => {
                setUser(userData);
            })
            .catch((error) => {
                console.error("Error loading users:", error);
            });
    };

    const setRecentAndTopReviews = () => {
        setRecentReviews(_.take(reviews, 8));
        const sortedReviews = _.orderBy(reviews, "creatorGrade", "desc");
        setTopReviews(_.take(sortedReviews, 8));
        setUniqueTags(_.uniq(_.flatMap(reviews, "tags")));
    };

    const handleAddReview = (newReview) => {
        setShowAddForm(false);
        fetchAndSetReviews();
    };

    const updateSearchResults = (results) => {
        console.log("results", results);
        setSearchResults(results);
    };

    const handleSearch = async () => {
        try {
            if (query.length > 1) {
                const response = await axios.get(`${API_URL}/search`, {
                    params: { query },
                });
                updateSearchResults(response.data, setSearchResults);
            } else if (query.length === 0) {
                updateSearchResults([], setSearchResults);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const searchTag = async (tag) => {
        setQuery(tag);
    };

    useEffect(() => {
        handleSearch(query);
    }, [query]);

    return (
        <Container
            sx={{
                maxWidth: { xs: "100%", md: "90%", lg: "80%" },
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
            }}
        >
            {/* Header */}
            <Grid container xs={12} md={12} width={"100%"} justifyContent="start">
                <Typography
                    variant="h1"
                    sx={{
                        mb: 2,
                        mt: 8,
                    }}
                >
                    <FormattedMessage
                        id="recentlyAddedReviews"
                        defaultMessage="Recently Added Reviews"
                    />
                </Typography>
            </Grid>

            {/* Search Bar */}
            <Grid container spacing={2} marginBottom={2} alignItems="center" width={"100%"}>
                <Grid item xs={12} md={6}>
                    <Grid width={"100%"}>
                        <Box
                            width={"100%"}
                            sx={{
                                display: "flex",
                                alignContent: "space-between",
                                alignItems: "baseline",
                                marginBottom: "10px",
                                marginTop: "10px",
                            }}
                        >
                            <TextField
                                id="outlined-search"
                                label={<FormattedMessage id="searchBox" defaultMessage="Search" />}
                                value={query}
                                sx={{
                                    marginRight: "10px",
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
                    </Grid>
                </Grid>
                {/* User Actions */}
                {user ? (
                    <>
                        <Grid item xs={12} md={6} width={"100%"} sx={{ textAlign: "right" }}>
                            <Link to={`/profile`} state={{ userData: user }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: "100px",
                                        border: "1px none ##7670FC",
                                        px: 2,
                                        py: 1,
                                        mx: "2px",
                                    }}
                                >
                                    <FormattedMessage id="profile" defaultMessage="Profile" />
                                </Button>
                            </Link>
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "100px",
                                    border: "1px none ##7670FC",
                                    px: 2,
                                    py: 1,
                                    mx: "2px",
                                }}
                                onClick={() => {
                                    logOut();
                                    setUser(null);
                                }}
                            >
                                <FormattedMessage id="logout" defaultMessage="Logout" />
                            </Button>
                            {!showAddForm && (
                                <Button
                                    variant="contained"
                                    onClick={() => setShowAddForm(true)}
                                    sx={{
                                        borderRadius: "100px",
                                        border: "1px none ##7670FC",
                                        px: 2,
                                        py: 1,
                                        mx: "2px",
                                    }}
                                >
                                    <FormattedMessage id="addReview" defaultMessage="Add Review" />
                                </Button>
                            )}
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                        <Link to={`/login`} state={""}>
                            <Button
                                variant="contained"
                                onClick={() => console.log("login")}
                                sx={{
                                    borderRadius: "100px",
                                    border: "1px none ##7670FC",
                                    px: 2,
                                    py: 1,
                                }}
                            >
                                <FormattedMessage id="login" defaultMessage="Login" />
                            </Button>
                        </Link>
                    </Grid>
                )}
            </Grid>
            {showAddForm && (
                <AddReview
                    onAddReview={handleAddReview}
                    onCloseForm={() => setShowAddForm(false)}
                    userId={user.id}
                    uniqueTags={uniqueTags}
                />
            )}

            {/* Reviews */}
            {reviews.length > 0 ? (
                <Grid container spacing={2}>
                    {/* Recently Added Reviews */}
                    <Box item xs={12} md={6} width={"100%"}></Box>
                    <Grid item xs={12} sx={{ mt: -2 }}>
                        {searchResults.length === 0 ? (
                            <>
                                <Grid container spacing={2} marginBottom={8} marginTop={1}>
                                    {recentReviews.map((review) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={6}
                                            lg={4}
                                            xl={3}
                                            key={review.id}
                                        >
                                            <ReviewCard
                                                review={review}
                                                user={user}
                                                handleTagClick={(tag) => {
                                                    setQuery(tag);
                                                    searchTag(tag);
                                                }}
                                                update={() => {
                                                    fetchAndSetReviews();
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) : (
                            <>
                                {/* Search Results */}
                                <Typography variant="h2" sx={{ mt: 0, mb: 4, width: "100%" }}>
                                    <FormattedMessage
                                        id="searchReviewsText"
                                        defaultMessage="Reviews Found"
                                    />
                                </Typography>
                                <Grid container spacing={2}>
                                    {searchResults.reviews
                                        ? searchResults.reviews.map((result) => (
                                              <Grid
                                                  item
                                                  xs={12}
                                                  sm={6}
                                                  md={6}
                                                  lg={4}
                                                  xl={3}
                                                  key={result.id}
                                              >
                                                  <SearchResultCard review={result} user={user} />
                                              </Grid>
                                          ))
                                        : null}
                                </Grid>
                                <Typography variant="h2" sx={{ mt: 2, mb: 4, width: "100%" }}>
                                    <FormattedMessage
                                        id="searchCommentsText"
                                        defaultMessage="Comments Found"
                                    />
                                </Typography>
                                <Grid container spacing={2}>
                                    {searchResults.comments
                                        ? searchResults.comments.map((result) => (
                                              <Grid
                                                  item
                                                  xs={12}
                                                  sm={6}
                                                  md={6}
                                                  lg={4}
                                                  xl={3}
                                                  key={result.id}
                                              >
                                                  <SearchResultCard
                                                      review={_.find(reviews, {
                                                          id: result.reviewId,
                                                      })}
                                                      user={user}
                                                  />
                                              </Grid>
                                          ))
                                        : null}
                                </Grid>
                            </>
                        )}
                    </Grid>
                    {/* Top Rated Reviews */}
                    <Grid item xs={12} sx={{ mt: -2 }}>
                        {searchResults.length === 0 ? (
                            <>
                                <Grid
                                    container
                                    xs={12}
                                    md={12}
                                    width={"100%"}
                                    justifyContent="start"
                                >
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            mb: 2,
                                            mt: 1,
                                        }}
                                    >
                                        <FormattedMessage
                                            id="topRatedReviews"
                                            defaultMessage="Top Rated Reviews"
                                        />
                                    </Typography>
                                </Grid>
                                <Grid container spacing={2} marginBottom={8}>
                                    {topReviews.map((review) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={6}
                                            lg={4}
                                            xl={3}
                                            key={review.id}
                                        >
                                            <ReviewCard
                                                review={review}
                                                user={user}
                                                update={() => {
                                                    fetchAndSetReviews();
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) : null}
                    </Grid>
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </Container>
    );
}

export default MainPage;
