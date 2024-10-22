import React, { useState, useContext } from "react";
import { login as loginAPI } from "../api/api";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(UserContext);

    const handleLogin = async () => {
        try {
            const { data } = await loginAPI({ username, password });
            login(data.token, data.role); // Store JWT and role
            alert("Login successful!");
            if (data.role === "Teacher") {
                // Redirect to teacher dashboard
                window.location.href = "/teacher";
            } else {
                // Redirect to quiz page for students
                window.location.href = "/student-quiz";
            }
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Login
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don’t have an account?{" "}
                    <Link to="/register">Register here</Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default Login;
