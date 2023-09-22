import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import ReviewCard from "./reviewCard/ReviewCard";
import SearchResultCard from "./reviewCard/SearchResultCard";
import AddReview from "./AddReview";
import Search from "./Search";
import _ from "lodash";
import Cookies from "js-cookie";
import UseTheme from "../UseTheme";
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
    Card,
    CardContent,
    GridListTile,
    ListSubheader,
    CircularProgress,
} from "@mui/material";
import messages from "../messages";

import { getReviews, getReviewsWithRetry } from "../services/reviewService";
import { getUserData, logOut } from "../services/userService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function MainPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const location = useLocation();
    const [searchResults, setSearchResults] = useState([]);
    const [currentLocale, setCurrentLocale] = useState("en");

    const MAX_RETRIES = 20;
    const RETRY_DELAY = 1000;

    function setToken() {
        const searchParams = new URLSearchParams(location.search);
        const message = searchParams.get("message");
        const jwtToken = searchParams.get("jwtToken");
        if (jwtToken) {
            Cookies.set("jwtToken", jwtToken, { expires: 60 * 60 * 4 });
            // window.location.href = `/`;
        }
    }

    // useEffect(() => {
    //     setToken();
    //     getUserData();
    //     getReviews();
    //     console.log("reviews", reviews);
    //     setSearchResults([]);
    // }, []);

    const fetchAndSetReviews = () => {
        console.log("fetchAndSetReviews");
        getReviews()
            .then((reviewData) => {
                setReviews(reviewData);
            })
            .catch((error) => {
                console.error("Error loading recently added reviews:", error);
            });
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

    useEffect(() => {
        setToken();
        // getUserData().then((userData) => {
        //     setUser(userData);
        //     getReviews().then((reviewData) => {
        //         setReviews(reviewData);
        //     });
        // });
        setSearchResults([]);
        setShowAddForm(false);
        console.log("fetchAndSetReviews");
        fetchAndSetUsers();
        fetchAndSetReviews();
    }, []);

    const handleAddReview = (newReview) => {
        console.log("review added");
        setShowAddForm(false);
        fetchAndSetReviews();
    };

    const updateSearchResults = (results) => {
        console.log("results", results);
        setSearchResults(results);
    };

    let theme = UseTheme().theme;

    console.log("reviews", reviews);
    console.log("searchResults", searchResults);
    return (
        // <IntlProvider locale={currentLocale} messages={intlMessages}>
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
            <Typography variant="h1" mt={8} mb={8}>
                <FormattedMessage
                    id="greeting"
                    defaultMessage="Review Portal"
                />
            </Typography>
            {reviews && (
                <>
                    <Grid
                        container
                        spacing={2}
                        marginBottom={4}
                        alignItems="center"
                    >
                        {user && (
                            <>
                                <Grid item>
                                    <Link
                                        to={`/profile`}
                                        state={{ userData: user }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx={{
                                                borderRadius: "100px",
                                                border: "1px none ##7670FC",
                                                px: 2,
                                                py: 1,
                                            }}
                                        >
                                            <FormattedMessage
                                                id="profile"
                                                defaultMessage="Profile"
                                            />
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: "100px",
                                            border: "1px none ##7670FC",
                                            px: 2,
                                            py: 1,
                                        }}
                                        onClick={() => {
                                            logOut();
                                            setUser(null);
                                        }}
                                    >
                                        <FormattedMessage
                                            id="logout"
                                            defaultMessage="Logout"
                                        />
                                    </Button>
                                </Grid>
                                {!showAddForm && (
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={() => setShowAddForm(true)}
                                            sx={{
                                                borderRadius: "100px",
                                                border: "1px none ##7670FC",
                                                px: 2,
                                                py: 1,
                                            }}
                                        >
                                            <FormattedMessage
                                                id="addReview"
                                                defaultMessage="addReview"
                                            />
                                        </Button>
                                    </Grid>
                                )}
                            </>
                        )}
                        {!user && (
                            <Grid item>
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
                                        <FormattedMessage
                                            id="login"
                                            defaultMessage="Login"
                                        />
                                    </Button>
                                </Link>
                            </Grid>
                        )}
                    </Grid>
                    {showAddForm && (
                        <AddReview
                            onAddReview={handleAddReview}
                            userId={user.id}
                        />
                    )}
                </>
            )}

            {reviews.length > 0 ? (
                <Grid container spacing={2}>
                    <Box px={"20px"} width={"100%"} mt={2}>
                        <Grid xs={12} md={12} width={"100%"}>
                            <Search
                                reviews={reviews}
                                updateResults={updateSearchResults}
                            />
                        </Grid>
                        <Grid
                            container
                            xs={12}
                            md={12}
                            width={"100%"}
                            justifyContent="center"
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: 4,
                                    mt: 2,
                                    // textAlign: "center",
                                    // alignSelf: "center",
                                    // ml: { xs: 0, md: "-100%" },
                                }}
                            >
                                <FormattedMessage
                                    id="recentlyAddedReviews"
                                    defaultMessage="Recently Added Reviews"
                                />
                            </Typography>
                        </Grid>
                    </Box>
                    <Grid item xs={12} sx={{ mt: -2 }}>
                        {searchResults.length === 0 ? (
                            <>
                                <Grid container spacing={2} marginBottom={8}>
                                    {reviews.map((review) => (
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
                                                    console.log("update");
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Typography
                                    variant="h2"
                                    sx={{ mt: 0, mb: 4, width: "100%" }}
                                >
                                    <FormattedMessage
                                        id="searchResults"
                                        defaultMessage="Search Results"
                                    />
                                </Typography>
                                <Grid container spacing={2}>
                                    {searchResults.reviews
                                        ? searchResults.reviews.map(
                                              (result) => (
                                                  <Grid
                                                      item
                                                      xs={12}
                                                      sm={6}
                                                      md={6}
                                                      lg={4}
                                                      xl={3}
                                                      key={result.id}
                                                  >
                                                      {/* <ReviewCard
                                                          review={result}
                                                          user={user}
                                                          update={() => {
                                                              fetchAndSetReviews();
                                                              console.log(
                                                                  "update"
                                                              );
                                                          }}
                                                      /> */}
                                                      <SearchResultCard
                                                          review={result}
                                                      />
                                                  </Grid>
                                              )
                                          )
                                        : null}
                                    {searchResults.comments
                                        ? searchResults.comments.map(
                                              (result) => (
                                                  <Grid
                                                      item
                                                      xs={12}
                                                      sm={6}
                                                      md={6}
                                                      lg={4}
                                                      xl={3}
                                                      key={result.id}
                                                  >
                                                      <Link
                                                          to={`/reviews/${result.id}`}
                                                          state={{
                                                              review: _.find(
                                                                  reviews,
                                                                  {
                                                                      id: result.id,
                                                                  }
                                                              ),
                                                              user: user,
                                                          }}
                                                      >
                                                          {"Comments :"}
                                                          <Typography
                                                              variant="h2"
                                                              sx={{
                                                                  mb: 4,
                                                                  mt: 2,
                                                                  // textAlign: "center",
                                                                  // alignSelf: "center",
                                                                  // ml: { xs: 0, md: "-100%" },
                                                              }}
                                                          >
                                                              {result.id}
                                                              {result.content}
                                                          </Typography>
                                                      </Link>
                                                  </Grid>
                                              )
                                          )
                                        : null}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </Container>
        // </IntlProvider>
    );
}

export default MainPage;
