import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import UserRating from "./UserRating";
import LikeButton from "./LikeButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
    Rating,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { handleLikeButton, submitRating } from "../../services/cardService";
import { styled } from "@mui/system";
import messages from "../../messages";

function ReviewCard({ review, user, update, size = 350, reviewDetail = false, handleTagClick }) {
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
        if (user) {
            if (user.ratedReviews && !userRating) {
                const ratingObj = user.ratedReviews.find((rating) => rating.reviewId === review.id);
                if (ratingObj) {
                    setUserRating(ratingObj.rating);
                }
            }
            if (user.likedReviews) {
                if (user.likedReviews.includes(review.id)) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
            }
        }
    }, [user]);

    const handleLikeButton = async (e) => {
        console.log("handleLikeButton");
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
        const isRated = user.ratedReviews.some((ratedReview) => ratedReview.reviewId === reviewId);
        const url = `${API_URL}/rating`;
        const method = "POST";
        const data = { userId, reviewId, rating };

        try {
            const response = await axios({ method, url, data });
            console.log("response", response);
            update();
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    const url = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${review.id}.jpg`;
    const alturl = "https://res.cloudinary.com/dp30nyp5m/image/upload/v1695340392/review2.jpg";
    const [imageSrc, setImageSrc] = useState(url);

    let canRun = true;
    const handleImageError = () => {
        setImageSrc(alturl);
    };

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
                            <CardMedia
                                component="img"
                                height={
                                    reviewDetail
                                        ? theme.heightOptions.option2
                                        : theme.heightOptions.option1
                                }
                                src={imageSrc}
                                alt={"Review Image"}
                                onError={handleImageError}
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
                sx={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "20px",
                    border: "1px solid #E8E8E8",
                    pb: "10px",
                }}
            >
                <div style={{ position: "relative" }}>
                    <CustomCardMedia />
                    {user && (
                        <Box
                            xs={6}
                            mb={1}
                            sx={{
                                position: "absolute",
                                top: "5%",
                                left: "5%",
                                display: "flex",
                                alignItems: "center",
                                padding: "0px",
                            }}
                        >
                            <LikeButton liked={liked} onClick={handleLikeButton} version={2} />
                        </Box>
                    )}
                </div>

                <CardContent sx={{ pt: "10px", px: "20px" }}>
                    <Box
                        // container
                        spacing={0}
                        direction="column"
                        sx={{ justifyContent: "space-around" }}
                    >
                        <Grid container spacing={0} pt={"2px"} pb={"6px"}>
                            <Grid
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "max-content",
                                }}
                            >
                                {
                                    <UserRating
                                        userRating={userRating}
                                        onUserRatingChange={(rating, e) => {
                                            console.log("rating = ", rating);
                                            submitRating(rating, e);
                                        }}
                                        averageRating={parseFloat(review.averageRating)}
                                        user={user ? true : false}
                                    />
                                }
                            </Grid>
                            <Grid>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        pl: "4px",
                                        fontSize: "18px",
                                        color: "#A7A7A7",
                                    }}
                                >
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
                                    width: "100%",
                                    textAlign: "start",
                                    display: "flex",
                                    // alignItems: "center",
                                    fontSize: "24px",
                                    fontWeight: "600",
                                    lineHeight: "1",
                                    height: "26px",
                                    maxHeight: "26px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    marginBottom: "4px",
                                    whiteSpace: "normal",
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
                                    // mt: "8px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {review.pieceName}
                                <Typography
                                    variant="body"
                                    color="text.secondary"
                                    sx={{
                                        marginBottom: "4px",
                                        alignSelf: "start",
                                        fontSize: "18px",
                                        fontWeight: "500",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        // color: "gray",
                                    }}
                                >
                                    {" - " + review.group}
                                </Typography>
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
                                    mb: "8px",
                                    textAlign: "justify",
                                    whiteSpace: "normal",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {review.reviewText}
                            </Typography>
                        </Box>

                        <Grid container spacing={2} height="48px">
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    height: "52px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <ReviewTags
                                    tags={review.tags}
                                    handleTagClick={(tag) => handleTagClick(tag)}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            padding={0}
                            mt={"0px"}
                            height="40px"
                            sx={{
                                justifyContent: "start",
                                alignItems: "center",
                            }}
                        >
                            <Grid item xs={4} sx={{ padding: "0px" }}>
                                {user && <LikeButton liked={liked} onClick={handleLikeButton} />}
                            </Grid>

                            <Grid
                                item
                                xs={4}
                                sx={{
                                    padding: "0px",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "end",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    textAlign={"end"}
                                    sx={{ justifyContent: "end" }}
                                >
                                    <FormattedMessage id="likes" defaultMessage="Likes:" />
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.primary"
                                    textAlign={"start"}
                                    sx={{ justifyContent: "end", fontWeight: "600" }}
                                >
                                    {review.likes}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={4}
                                sx={{
                                    padding: "0px",
                                    display: "flex",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    textAlign={"start"}
                                    sx={{ justifyContent: "end" }}
                                >
                                    <FormattedMessage id="grade" defaultMessage="grade :" />
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.primary"
                                    textAlign={"start"}
                                    sx={{ justifyContent: "end", fontWeight: "600" }}
                                >
                                    {" " + review.creatorGrade}
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
