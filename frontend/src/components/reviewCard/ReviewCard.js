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

    const CustomCardMedia = () => {
        return (
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
                                // alt="Review Image"
                            />
                        </Box>
                    </CardActionArea>
                </StyledCardMedia>
            </Link>
        );
    };

    const intlMessages = messages[currentLocale];

    const theme = useTheme();

    return (
        <IntlProvider locale={currentLocale} messages={intlMessages}>
            <Card
                sx={{ width: "100%", maxWidth: "500px", borderRadius: "20px" }}
            >
                <div style={{ position: "relative" }}>
                    <CustomCardMedia />
                    {user && (
                        <Grid
                            xs={6}
                            mb={1}
                            sx={{
                                position: "absolute",
                                top: "5%",
                                left: "5%",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <LikeButton
                                liked={liked}
                                onClick={handleLikeButton}
                            />
                        </Grid>
                    )}
                </div>

                <CardContent sx={{ pt: "10px", px: "20px" }}>
                    <Box
                        container
                        spacing={0}
                        direction="column"
                        sx={{ justifyContent: "space-around" }}
                    >
                        <Grid container spacing={0} pt={1} pb={1}>
                            <Grid
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
                            <Grid>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        pl: "4px",
                                        fontSize: "16px",
                                        color: "#A7A7A7",
                                    }}
                                >
                                    {/* <FormattedMessage
                                        id="averageRating"
                                        defaultMessage="Average Rating:"
                                    /> */}
                                    {"("}
                                    {review.averageRating}
                                    {")"}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box container spacing={2} direction="column">
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    textAlign: "start",
                                    height: "35px",

                                    fontSize: "24px",
                                    fontWeight: "700",
                                    lineHeight: "1",
                                }}
                            >
                                {review.reviewName}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.primary"
                                sx={{
                                    marginBottom: "4px",
                                    alignSelf: "start",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    mt: "8px",
                                }}
                            >
                                {review.pieceName}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{
                                    height: reviewDetail ? "fit" : "140px",
                                    maxHeight: reviewDetail ? "500px" : "140px",
                                    overflow: "hidden",
                                    fontSize: "16px",
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
                        </Box>

                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    height: "64px",
                                }}
                            >
                                <ReviewTags tags={review.tags} />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            padding={0}
                            mt={"0px"}
                            sx={{ alignSelf: "flex-end" }}
                        >
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
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
                                    variant="body1"
                                    color="text.secondary"
                                    textAlign={"end"}
                                >
                                    <FormattedMessage
                                        id="grade"
                                        defaultMessage="grade :"
                                    />
                                    {review.creatorGrade}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </IntlProvider>
    );
}

export default ReviewCard;
