import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
    console.log("login");
    const handleGoogleLogin = () => {
        const loginUrl = `${API_URL}/auth/google`;
        window.location.href = loginUrl;
        // window.open(loginUrl, "_blank");
    };

    const handleGithubLogin = () => {
        const loginUrl = `${API_URL}/auth/github`;
        window.location.href = loginUrl;

        // window.open(loginUrl, "_blank");
    };

    // handleGithubLogin;

    // const handleAuthenticationResponse = () => {
    //     console.log("handleAuthenticationResponse");
    //     const urlParams = new URLSearchParams(window.location.search);
    //     if (urlParams.has("jwtToken")) {
    //         const jwtToken = urlParams.get("jwtToken");
    //         localStorage.setItem("jwtToken", jwtToken);
    //         window.location.href = `${ALLOWED_ORIGINS}/dashboard`;
    //     } else {
    //         console.log("Authentication failed");
    //     }
    // };

    // handleAuthenticationResponse();

    // const handleGoogleLogin = () => {
    //     const url = `${API_URL}/auth/google`;
    //     window.open(url, "_blank");
    // };

    // return (
    //     <div>
    //         <h2>Login Page</h2>
    //         <button onClick={handleGoogleLogin}>Login with Google</button>
    //     </div>
    // );

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "90vh",
                gap: "20px",
            }}
        >
            <Typography variant="h2" align="center" gutterBottom>
                Login Page
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoogleLogin}
                sx={{ width: "40%" }}
            >
                Login with Google
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGithubLogin}
                sx={{ width: "40%" }}
            >
                Login with Github
            </Button>
        </Container>
    );
}

export default Login;
