import React, { useState } from "react";
import { register as registerAPI } from "../api/api";
import { Link } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Student");

    const handleRegister = async () => {
        try {
            await registerAPI({ username, password, role });
            alert("Registration successful!");
            window.location.href = "/login";
        } catch (error) {
            alert("Registration failed");
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
                    Register
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
                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        label="Role"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Teacher">Teacher</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleRegister}
                >
                    Register
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default Register;
