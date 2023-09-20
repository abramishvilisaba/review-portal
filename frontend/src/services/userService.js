import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function getUserData() {
    const token = Cookies.get("jwtToken");

    try {
        const response = await axios.get(`${API_URL}/auth/getuserdata`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            id: response.data.userId,
            name: response.data.userName,
            likedReviews: response.data.likedReviews,
            ratedReviews: response.data.ratedReviews,
        };
    } catch (error) {
        console.log("error retrieving user data : ", error);
        return null;
    }
}

export async function logOut() {
    try {
        console.log("==============================================");
        const response = await axios.post(`${API_URL}/auth/logout`);
        console.log(response);
        Cookies.remove("jwtToken", { path: "/" });
        return true;
    } catch (error) {
        console.error("Error logging out:", error);
        return false;
    }
}
