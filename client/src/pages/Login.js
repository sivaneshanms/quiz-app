import React, { useState, useContext } from "react";
import { login as loginAPI } from "../api/api";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(UserContext);

    const handleLogin = async () => {
        try {
            const { data } = await loginAPI({ username, password });
            login(data.token, data.role); // Store JWT and role
            alert("Login successful!");
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <>
            <div>
                <h2>Login</h2>
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
                <button onClick={handleLogin}>Login</button>
            </div>
            <Link to="/dashboard">
                <button>Go to Dashboard</button>
            </Link>
            <Link to="/questions">
                <button>View Questions</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </>
    );
}

export default Login;