// src/pages/TeacherDashboard.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TeacherDashboard() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ]);

    const handleOptionChange = (index, key, value) => {
        const newOptions = [...options];
        newOptions[index][key] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); // Assuming token is stored here
            await axios.post(
                `${process.env.REACT_APP_API_URL}/questions`,
                { text: question, options },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Question created successfully");
        } catch (error) {
            console.error("Error creating question:", error);
            alert("Failed to create question");
        }
    };

    return (
        <>
            <div>
                <h2>Create a New Quiz Question</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Question:</label>
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Enter your question"
                            required
                        />
                    </div>
                    {options.map((option, index) => (
                        <div key={index}>
                            <label>Option {index + 1}:</label>
                            <input
                                value={option.text}
                                onChange={(e) =>
                                    handleOptionChange(
                                        index,
                                        "text",
                                        e.target.value
                                    )
                                }
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                            <label>
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={option.isCorrect}
                                    onChange={() =>
                                        handleOptionChange(
                                            index,
                                            "isCorrect",
                                            true
                                        )
                                    }
                                />
                                Correct Answer
                            </label>
                        </div>
                    ))}
                    <button type="submit">Create Question</button>
                </form>
            </div>
            <Link to="/login">
                <button>Login</button>
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

export default TeacherDashboard;
