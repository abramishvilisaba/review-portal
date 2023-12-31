import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import ReviewCard from "../reviewCard/ReviewCard";
import EditReview from "../EditReview";
import _ from "lodash";
import { IntlProvider, FormattedMessage } from "react-intl";

import { deleteReview } from "../../services/reviewService";
import {
    Container,
    Typography,
    Paper,
    Table,
    Grid,
    Box,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    TextField,
} from "@mui/material";
// import { makeStyles } from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;

function Profile({}) {
    let { state } = useLocation();
    const userData = state.userData;

    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [sortOption, setSortOption] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterValue, setFilterValue] = useState("");
    const [filteredReviews, setFilteredReviews] = useState(reviews);

    const fetchUserReviews = async (userId) => {
        try {
            setUser(userData);
            axios.get(`${apiUrl}/profile/${userData.id}`).then((response) => {
                setReviews(response.data);
                setFilteredReviews(response.data);
            });
        } catch (error) {
            console.log("error fetching reviews", error);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUserReviews();
        }
    }, [userData]);

    useEffect(() => {}, []);

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
    };

    const sortReviews = (reviews, sortOrder, sortBy) => {
        const sortedReviews = _.orderBy(reviews, [sortBy], [sortOrder]);
        return sortedReviews;
    };

    const handleSortClick = (sortBy) => {
        toggleSortOrder();
        const sortedReviews = sortReviews(filteredReviews, sortOrder, sortBy);
        setFilteredReviews(sortedReviews);
    };

    const handleFilterChange = (e) => {
        const newFilterValue = e.target.value;
        setFilterValue(newFilterValue);
        const filteredReviews = reviews.filter((review) =>
            review.reviewName.toLowerCase().includes(newFilterValue.toLowerCase())
        );
        const sortedReviews = sortReviews(filteredReviews, sortOrder, "reviewName");
        setFilteredReviews(sortedReviews);
    };

    const SortableTableHeaderButton = ({ text, name }) => {
        return (
            <TableCell>
                <Button
                    onClick={() => {
                        handleSortClick(name);
                    }}
                    sx={{ ml: "-8px" }}
                >
                    {text}
                </Button>
            </TableCell>
        );
    };

    const createdAt = "2023-09-20T18:23:25.000Z";
    const date = new Date(createdAt);

    const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC",
    });

    const handleReviewDelete = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
            setFilteredReviews((prevReviews) =>
                prevReviews.filter((review) => review.id !== reviewId)
            );
            // fetchUserReviews()
        } catch (error) {
            console.log(`Error deleting review: ${error.message}`);
        }
    };

    function formatDateTime(dateTimeString) {
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateTimeString).toLocaleDateString("en-GB", options);
    }

    return (
        <div>
            <Paper
                elevation={5}
                sx={{
                    padding: "16px",
                    width: { sm: "100%", md: "90%", lg: "70%" },
                    minWidth: "fit-Content",
                    margin: "auto",
                    marginTop: "80px",
                }}
            >
                {user && reviews && filteredReviews ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h2" align="center" gutterBottom>
                                <FormattedMessage id="profile" defaultMessage="profile" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Search Reviews"
                                variant="outlined"
                                value={filterValue}
                                onChange={handleFilterChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <SortableTableHeaderButton
                                            text={
                                                <FormattedMessage
                                                    id="reviewName"
                                                    defaultMessage="reviewName"
                                                />
                                            }
                                            name="reviewName"
                                        />
                                        <SortableTableHeaderButton
                                            text={
                                                <FormattedMessage
                                                    id="pieceName"
                                                    defaultMessage="pieceName"
                                                />
                                            }
                                            name="pieceName"
                                        />
                                        <SortableTableHeaderButton
                                            text={
                                                <FormattedMessage
                                                    id="group"
                                                    defaultMessage="group"
                                                />
                                            }
                                            name="group"
                                        />
                                        <SortableTableHeaderButton
                                            text={
                                                <FormattedMessage
                                                    id="createdAt"
                                                    defaultMessage="createdAt"
                                                />
                                            }
                                            name="createdAt"
                                        />
                                        <SortableTableHeaderButton
                                            text={
                                                <FormattedMessage
                                                    id="likes"
                                                    defaultMessage="likes"
                                                />
                                            }
                                            name="likes"
                                        />
                                        <SortableTableHeaderButton
                                            text={
                                                <FormattedMessage
                                                    id="averageRating"
                                                    defaultMessage="averageRating"
                                                />
                                            }
                                            name="averageRating"
                                        />

                                        <TableCell>Edit</TableCell>
                                        <TableCell>Open</TableCell>
                                        <TableCell>Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredReviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>{review.reviewName}</TableCell>
                                            <TableCell>{review.pieceName}</TableCell>
                                            <TableCell>{review.group}</TableCell>
                                            <TableCell>
                                                {formatDateTime(review.createdAt)}
                                            </TableCell>
                                            <TableCell>{review.likes}</TableCell>
                                            <TableCell>{review.averageRating}</TableCell>
                                            <TableCell>
                                                <Button
                                                    component={Link}
                                                    to={`/EditReview`}
                                                    state={{
                                                        review: review,
                                                        user: user,
                                                    }}
                                                    sx={{ ml: "-14px" }}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    component={Link}
                                                    to={`/reviews/${review.id}`}
                                                    state={{
                                                        review: review,
                                                        user: user,
                                                    }}
                                                    sx={{ ml: "-14px" }}
                                                >
                                                    Open
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() => {
                                                        // deleteReview(review.id)
                                                        handleReviewDelete(review.id);
                                                    }}
                                                    sx={{ ml: "-14px" }}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                ) : (
                    <p>Loading user information...</p>
                )}
            </Paper>
        </div>
    );

    // return (
    //     <div>
    //         <Paper
    //             elevation={5}
    //             sx={{
    //                 padding: "16px",
    //                 maxWidth: "70%",
    //                 margin: "auto",
    //                 marginTop: "80px",
    //             }}
    //         >
    //             {user && reviews ? (
    //                 <div>
    //                     <Typography variant="h2" align="center" gutterBottom>
    //                         Profile Page {user.displayName}
    //                     </Typography>
    //                     <Grid container spacing={2}>
    //                         {reviews.map((review) => (
    //                             <Grid
    //                                 item
    //                                 key={review.id}
    //                                 xs={12}
    //                                 sm={6}
    //                                 md={4}
    //                                 lg={3}
    //                             >
    //                                 <Link
    //                                     to={`/reviews/${review.id}`}
    //                                     state={{ review: review, user: user }}
    //                                 >
    //                                     <ReviewCard review={review} />
    //                                 </Link>
    //                             </Grid>
    //                         ))}
    //                     </Grid>
    //                 </div>
    //             ) : (
    //                 <p>Loading user information...</p>
    //             )}
    //         </Paper>
    //     </div>
    // );
}

export default Profile;
