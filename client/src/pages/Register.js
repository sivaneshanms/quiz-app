import React, { useState } from "react";
import { register as registerAPI } from "../api/api";
import { Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Student");

    const handleRegister = async () => {
        try {
            await registerAPI({ username, password, role });
            alert("Registration successful!");
        } catch (error) {
            alert("Registration failed");
        }
    };

    return (
        <>
            <div>
                <h2>Register</h2>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </select>
                <button onClick={handleRegister}>Register</button>
            </div>
            <Link to="/dashboard">
                <button>Go to Dashboard</button>
            </Link>
            <Link to="/questions">
                <button>View Questions</button>
            </Link>
            <Link to="/login">
                <button>Login</button>
            </Link>
        </>
    );
}

export default Register;
