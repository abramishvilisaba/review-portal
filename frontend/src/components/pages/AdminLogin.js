// AdminLogin.js
import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function AdminLogin() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/admin/login`, { username, password });
            const adminToken = response.data.adminToken;
            Cookies.set("jwtToken", adminToken, { expires: 60 * 60 * 4 });
            navigate("/AdminPage");
        } catch (error) {
            console.log("Error logging in as admin:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" marginTop={24}>
                <Typography marginBottom={4} variant="h4">
                    Admin Login
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    sx={{ width: "fit", mt: 4, px: 6 }}
                    size="large"
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}

export default AdminLogin;
