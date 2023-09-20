import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import UserRating from "./UserRating";
import LikeButton from "./LikeButton";
// import ReviewImage from "./ReviewImage";
import ReviewTags from "./ReviewTags";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { IntlProvider, FormattedMessage } from "react-intl";

import { useTheme } from "@mui/material/styles";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
    CardMedia,
    CssBaseline,
    Container,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { handleLikeButton, submitRating } from "../../services/cardService";
import { styled } from "@mui/system";
import messages from "../../messages";

function ReviewCard({
    review,
    user,
    update,
    size = 350,
    reviewDetail = false,
}) {
    const [userRating, setUserRating] = useState(0);
    const [liked, setLiked] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [currentLocale, setCurrentLocale] = useState("en");

    const API_URL = process.env.REACT_APP_API_URL;

    const StyledCardMedia = styled(CardMedia)({
        transition: "transform 0.15s ease-in-out",
        "&:hover": {
            transform: reviewDetail ? "none" : "scale(1.05)",
        },
    });

    const handleLike = (e) => {
        // e.preventDefault();

        handleLikeButton(liked, user, review, update);
    };

    const rateReview = (rating, e) => {
        e.preventDefault();
        submitRating(rating, user, review, update);
    };

    useEffect(() => {
        // if (review) {
        //     if (review.Ratings) {
        //         if (review.Ratings[0]) {
        //             setAverageRating(
        //                 parseFloat(review.Ratings[0].averageRating).toFixed(1)
        //             );
        //         }
        //     }
        // }
        if (user) {
            if (user.ratedReviews && !userRating) {
                const ratingObj = user.ratedReviews.find(
                    (rating) => rating.reviewId === review.id
                );
                if (ratingObj) {
                    // console.log("found------------", ratingObj.rating);
                    setUserRating(ratingObj.rating);
                }
            }
            if (user.likedReviews.includes(review.id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
    }, [user]);

    const handleLikeButton = async (e) => {
        console.log("handleLikeButton");
        // e.preventDefault();
        const action = liked ? "unlike" : "like";
        const method = liked ? "delete" : "post";
        const url = `${API_URL}/likes/${action}`;
        const payload = { userId: user.id, reviewId: review.id };
        try {
            const response = await axios({
                method: method,
                url: url,
                data: payload,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setLiked(!liked);
            update();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const submitRating = async (rating, e) => {
        e.preventDefault();
        setUserRating(rating);
        const userId = user.id;
        const reviewId = review.id;
        const isRated = user.ratedReviews.some(
            (ratedReview) => ratedReview.reviewId === reviewId
        );
        // const url = isRated
        //     ? `${API_URL}/rating/${reviewId}`
        //     : `${API_URL}/rating`;
        // const method = isRated ? "PUT" : "POST";
        const url = `${API_URL}/rating`;
        const method = "POST";
        const data = { userId, reviewId, rating };
        console.log(url);

        try {
            const response = await axios({ method, url, data });
            console.log("response", response);
            update();
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    // async function submitRating(rating) {
    //     setUserRating(rating);
    //     const userId = user.id;
    //     const reviewId = review.id;

    //     const isRated = user.ratedReviews.some(
    //         (ratedReview) => ratedReview.reviewId === reviewId
    //     );
    //     const url = isRated
    //         ? `${API_URL}/rating/${reviewId}`
    //         : `${API_URL}/rating`;
    //     const method = isRated ? "PUT" : "POST";
    //     const data = { userId, reviewId, rating };

    //     try {
    //         const response = await axios({ method, url, data });
    //         update();
    //         return response.data;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const url = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${review.reviewName}/${review.id}.jpg`;

    // const { locale } = useParams();
    // useEffect(() => {
    //     if (locale) {
    //         if (locale.length === 2 && typeof locale === "string") {
    //             setCurrentLocale(locale);
    //         }
    //     }
    // }, [locale]);

    const intlMessages = messages[currentLocale];

    const theme = useTheme();

    return (
        <IntlProvider locale={currentLocale} messages={intlMessages}>
            <Card sx={{ width: "100%", maxWidth: "500px" }}>
                <Link
                    to={`/reviews/${review.id}`}
                    state={{
                        review: review,
                        user: user,
                    }}
                >
                    <StyledCardMedia>
                        <CardActionArea disabled={reviewDetail}>
                            <Box
                                sx={{
                                    width: "100%",
                                    bgcolor: "gray",
                                }}
                            >
                                {/* <ReviewImage
                                id={review.id}
                                // sx={{
                                //     width: "100%",
                                //     height: "100%",
                                // }}
                                // imageSize={500}
                            /> */}
                                <CardMedia
                                    component="img"
                                    // height={300}
                                    // height={
                                    //     reviewDetail ? "heightOption2" : undefined
                                    // }
                                    height={
                                        reviewDetail
                                            ? theme.heightOptions.option2
                                            : theme.heightOptions.option1
                                    }
                                    image={url}
                                    alt="Review Image"
                                />
                            </Box>
                        </CardActionArea>
                    </StyledCardMedia>
                </Link>

                <CardContent sx={{ pt: "10px", px: "15px" }}>
                    <Grid container spacing={0} direction="column">
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                textAlign: "center",
                                height: "90px",
                                fontSize: "32px",
                            }}
                        >
                            {review.reviewName}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            sx={{ marginBottom: "4px", alignSelf: "center" }}
                        >
                            {review.pieceName}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{
                                height: reviewDetail ? "fit" : "125px",
                                maxHeight: reviewDetail ? "500px" : "125px",
                                overflow: "hidden",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                px: "2px",
                                mb: "20px",
                                textAlign: "justify",
                                whiteSpace: "normal",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {review.reviewText}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={1}
                                    mb={1}
                                >
                                    <FormattedMessage
                                        id="grade"
                                        defaultMessage="grade :"
                                    />
                                    {review.creatorGrade}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                }}
                            >
                                <ReviewTags tags={review.tags} />
                            </Grid>
                        </Grid>

                        {user && (
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    xs={6}
                                    mb={1}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <LikeButton
                                        liked={liked}
                                        onClick={handleLikeButton}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "max-content",
                                    }}
                                >
                                    <UserRating
                                        userRating={userRating}
                                        // onUserRatingChange={(rating, e) => {
                                        //     console.log(
                                        //         "onUserRatingChange"
                                        //     );
                                        //     submitRating(rating, e);
                                        // }}
                                        onUserRatingChange={(rating, e) => {
                                            console.log(rating);
                                            submitRating(rating, e);
                                        }}
                                        averageRating={averageRating}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        <Grid container spacing={2} padding={0}>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <FormattedMessage
                                        id="likes"
                                        defaultMessage="Likes:"
                                    />
                                    {review.likes}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{}}
                                >
                                    <FormattedMessage
                                        id="averageRating"
                                        defaultMessage="Average Rating:"
                                    />
                                    {review.averageRating}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </IntlProvider>
    );
}

export default ReviewCard;
