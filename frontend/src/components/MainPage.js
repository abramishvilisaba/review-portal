import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import ReviewCard from "./reviewCard/ReviewCard";
import AddReview from "./AddReview";
// import Search from "./Search";
// import "../App.css";

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

    // function setToken() {
    //     const searchParams = new URLSearchParams(location.search);
    //     const message = searchParams.get("message");
    //     const jwtToken = searchParams.get("jwtToken");
    //     if (jwtToken) {
    //         Cookies.set("jwtToken", jwtToken, { expires: 60 * 60 * 4 });
    //         // window.location.href = `/`;
    //     }
    // }

    // const getReviews = async () => {
    //     console.log("getReview-----------------------------------------------");
    //     axios
    //         .get(`${API_URL}/reviews/recentlyAdded`)
    //         .then((response) => {
    //             setReviews(response.data);
    //             console.log("reviews", response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error loading recently added reviews:", error);
    //         });
    // };

    // const getReviewsWithRetry = async () => {
    //     let retries = 0;
    //     let reviewsData = null;
    //     while (retries < MAX_RETRIES) {
    //         console.log("retry connection-----------", retries);
    //         try {
    //             const response = await axios.get(
    //                 `${API_URL}/reviews/recentlyAdded`
    //             );
    //             reviewsData = response.data;
    //             setReviews(reviewsData);
    //             setConnected(true);
    //             break;
    //         } catch (error) {
    //             console.error("Error loading recently added reviews:", error);
    //             await new Promise((resolve) =>
    //                 setTimeout(resolve, RETRY_DELAY)
    //             );
    //             retries++;
    //         }
    //     }
    // };

    // const getUserData = async () => {
    //     const token = Cookies.get("jwtToken");

    //     axios
    //         .get(`${API_URL}/auth/getuserdata`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //         .then((response) => {
    //             setUser({
    //                 id: response.data.userId,
    //                 name: response.data.userName,
    //                 email: response.data.userEmail,
    //                 likedReviews: response.data.likedReviews,
    //                 ratedReviews: response.data.ratedReviews,
    //             });
    //             console.log(response.data);
    //         })
    //         .catch((error) => {
    //             console.log("error retrieving user data : ", error);
    //         });
    // };

    // const logOut = async () => {
    //     axios
    //         .post(`${API_URL}/auth/logout`)
    //         .then((response) => {
    //             console.log(response);
    //             setUser(null);
    //             Cookies.remove("jwtToken", { path: "/" });
    //             // window.location.href = `/`;
    //         })
    //         .catch((error) => {
    //             console.error("Error loading recently added reviews:", error);
    //         });
    // };

    // useEffect(() => {
    //     setToken();
    //     getUserData();
    //     getReviews();
    //     console.log("reviews", reviews);
    //     setSearchResults([]);
    // }, []);

    useEffect(() => {
        // setToken();
        getUserData().then((userData) => {
            setUser(userData);
            getReviews().then((reviewData) => {
                setReviews(reviewData);
                console.log("reviews", reviewData);
            });
        });
    }, []);

    const handleAddReview = (newReview) => {
        console.log("review added");
        getReviews();
        setShowAddForm(false);
    };

    const updateSearchResults = (results) => {
        setSearchResults(results);
    };

    let theme = UseTheme().theme;

    const { locale } = useParams();
    useEffect(() => {
        if (locale.length === 2 && typeof locale === "string") {
            setCurrentLocale(locale);
        }
    }, [locale]);
    const intlMessages = messages[locale];

    console.log(user);

    return (
        <IntlProvider locale={currentLocale} messages={intlMessages}>
            <Container
                maxWidth="lg"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
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
                                        {/* <Link
                                        to={`/profile`}
                                        state={{ userData: user }}
                                    > */}
                                        <Button variant="contained">
                                            <FormattedMessage
                                                id="profile"
                                                defaultMessage="Profile"
                                            />
                                        </Button>
                                        {/* </Link> */}
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
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
                                                onClick={() =>
                                                    setShowAddForm(true)
                                                }
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
                <Grid container spacing={2}>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                        px={"20px"}
                    >
                        <Grid item xs={12} md={6}>
                            {/* <Search
                            reviews={reviews}
                            updateResults={updateSearchResults}
                        /> */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: 4,
                                    textAlign: "center",
                                    ml: { xs: 0, md: "-100%" },
                                }}
                            >
                                <FormattedMessage
                                    id="recentlyAddedReviews"
                                    defaultMessage="Recently Added Reviews"
                                />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: -2 }}>
                        {searchResults.length === 0 ? (
                            <>
                                <Grid container spacing={2}>
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
                                                update={getReviews}
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
                                    {searchResults.map((result) => (
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
                                                update={getReviews}
                                            /> */}
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </IntlProvider>
    );
}

export default MainPage;
