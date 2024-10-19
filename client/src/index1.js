// src/pages/TeacherDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

function TeacherDashboard() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ]);
    const [isEditMode, setIsEditMode] = useState(false); // Track if we're editing
    const [questionId, setQuestionId] = useState(null); // To store question ID when editing
    const { id } = useParams(); // Fetching question ID from route params (if editing)
    const navigate = useNavigate();

    // Fetch question details if editing
    useEffect(() => {
        if (id) {
            console.log("id came", id);
            setIsEditMode(true);
            fetchQuestionDetails(id); // Load question data
        }
    }, [id]);

    const fetchQuestionDetails = async (id) => {
        console.log("id", id);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/questions/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const questionData = response.data;

            setQuestion(questionData.text);
            setOptions(
                questionData.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.id === questionData.correct_option,
                }))
            );
            setQuestionId(questionData.id);
        } catch (error) {
            console.error("Error fetching question details:", error);
        }
    };

    const handleOptionChange = (index, key, value) => {
        const newOptions = [...options];
        newOptions[index][key] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const correctOptionIndex = options.findIndex(
                (opt) => opt.isCorrect
            );
            const correctOptionId = correctOptionIndex + 1; // Adjust index as needed

            if (isEditMode && questionId) {
                // Update existing question
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/questions/${questionId}`,
                    { text: question, options, correctOptionId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Question updated successfully");
            } else {
                // Create a new question
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/questions`,
                    { text: question, options, correctOptionId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Question created successfully");
            }
            navigate("/questions"); // Redirect to questions list after successful submit
        } catch (error) {
            console.error("Error saving question:", error);
            alert("Failed to save question");
        }
    };

    return (
        <>
            <div>
                <h2>{isEditMode ? "Edit" : "Create"} Quiz Question</h2>
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
                    <button type="submit">
                        {isEditMode ? "Update Question" : "Create Question"}
                    </button>
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
