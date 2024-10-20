import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/TeacherDashboard";
import QuestionsList from "./pages/QuestionsList"; // Import the QuestionsList component

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/teacher" element={<Dashboard />} />
                    <Route path="/student-quiz" element={<QuestionsList />} />{" "}
                    {/* Add route for QuestionsList */}
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
