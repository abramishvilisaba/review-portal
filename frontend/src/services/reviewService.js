import axios from "axios";

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

export async function getReviewsWithRetry() {}
