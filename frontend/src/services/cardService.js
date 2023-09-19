import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
export async function handleLikeButton(liked, user, review, update) {
    const action = liked ? "unlike" : "like";
    const method = liked ? "delete" : "post";
    const url = `${API_URL}/likes/${action}`;
    const payload = { userId: user.id, reviewId: review.id };

    try {
        const response = await axios({
            method,
            url,
            data: payload,
            headers: {
                "Content-Type": "application/json",
            },
        });

        update();
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function submitRating(rating, user, review, update) {
    const userId = user.id;
    const reviewId = review.id;

    const isRated = user.ratedReviews.some(
        (ratedReview) => ratedReview.reviewId === reviewId
    );

    const url = `${API_URL}/rating`;
    const method = "POST";
    const data = { userId, reviewId, rating };

    try {
        const response = await axios({ method, url, data });
        update();
    } catch (error) {
        console.error(error);
    }
}
