import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { BrowserRouter, Route, Routes, useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
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
                Login
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoogleLogin}
                sx={{ width: { xs: "60%", sm: "40%", md: "25%", lg: "20%" } }}
            >
                Login with Google
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGithubLogin}
                sx={{ width: { xs: "60%", sm: "40%", md: "25%", lg: "20%" } }}
            >
                Login with Github
            </Button>

            <Link to={`/AdminLogin`}>
                <Button
                    variant="contained"
                    color="primary"

                    // onClick={}
                    // sx={{ width: { xs: "60%", sm: "40%", md: "25%", lg: "20%" } }}
                >
                    Admin Login
                </Button>
            </Link>
        </Container>
    );
}

export default Login;
