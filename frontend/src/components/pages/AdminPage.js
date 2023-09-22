import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {}, []);

    const navigateToUserProfile = (userId) => {};

    function fetchUserData() {
        const token = Cookies.get("adminToken");

        axios
            .get(`${API_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const userData = response.data;
                console.log("Fetched user data:", userData);
                setUsers(userData);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    console.log(users);

    const containerStyle = {
        maxWidth: "50%",
        margin: "0 auto",
        marginTop: "2rem",
    };

    const titleStyle = {
        marginBottom: "1rem",
        textAlign: "center",
    };

    const actionButtonStyle = {
        minWidth: "120px",
    };

    return (
        <div style={containerStyle}>
            <Typography variant="h4" style={titleStyle}>
                Admin Page
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell style={actionButtonStyle}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Link to={`/profile`} state={{ userData: user }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => navigateToUserProfile(user.id)}
                                            style={actionButtonStyle}
                                        >
                                            View Profile
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AdminPage;
