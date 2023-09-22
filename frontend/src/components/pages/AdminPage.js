import React, { useState, useEffect } from "react";
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

    useEffect(() => {}, []);

    const navigateToUserProfile = (userId) => {};

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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigateToUserProfile(user.id)}
                                        style={actionButtonStyle}
                                    >
                                        View Profile
                                    </Button>
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
