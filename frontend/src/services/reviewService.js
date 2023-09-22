import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function getReviews() {
    try {
        const response = await axios.get(`${API_URL}/reviews/recentlyAdded`);
        return response.data;
    } catch (error) {
        console.error("Error loading recently added reviews:", error);
        return [];
    }
}
export async function deleteReview(reviewId) {
    const token = Cookies.get("jwtToken");
    axios
        .delete(`${API_URL}/reviews/delete/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.status === 204) {
                // navigate("/");
                console.log(response.data);
            } else {
                console.log("Failed to delete review.");
            }
        })
        .catch((error) => {
            console.log(`Error deleting review: ${error.message}`);
        });
}

export async function getReviewsWithRetry() {}
