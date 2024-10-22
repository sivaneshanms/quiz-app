import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    CircularProgress,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";

function TeacherDashboard() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ]);
    const [questionsList, setQuestionsList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [questionIdToEdit, setQuestionIdToEdit] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [correctAnswerIndex, setCorrectAnswerIndex] = React.useState(null);

    const handleCorrectAnswerChange = (event) => {
        const index = event.target.value;
        setCorrectAnswerIndex(index);
        handleOptionChange(index, "isCorrect", true);
        // Mark all other options as incorrect
        options.forEach((_, i) => {
            if (i !== index) {
                handleOptionChange(i, "isCorrect", false);
            }
        });
    };

    // Fetch all questions
    useEffect(() => {
        fetchQuestions();
    }, []);

    // useEffect(() => {
    //     if (id) {
    //         console.log("id came", id);
    //         setEditMode(true);
    //         fetchQuestions(id); // Load question data
    //     }
    // }, [id]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // This adds smooth scrolling
        });
    };

    const fetchQuestions = async (id = null) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/questions/${id ?? ''}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setQuestionsList(response.data.questions);
            console.log('response.data.questions', response.data.questions)
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form option changes
    const handleOptionChange = (index, key, value) => {
        const newOptions = [...options];
        newOptions[index][key] = value;
        setOptions(newOptions);
    };

    const handleLogout = () => {
        // Clear the stored token (JWT) and role from localStorage or context
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Redirect the user to the login page
        window.location.href = "/login";
    };

    // Handle question submit (create or edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = { text: question, options };

        try {
            if (editMode && questionIdToEdit) {
                // Update an existing question
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/questions/${questionIdToEdit}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Question updated successfully");
            } else {
                // Create a new question
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/questions`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Question created successfully");
            }
            resetForm();
            fetchQuestions(); // Refresh the question list after create/edit
        } catch (error) {
            console.error("Error creating/updating question:", error);
            alert("Failed to save question");
        }
    };

    // Handle editing a specific question
    const handleEdit = (question) => {
        setEditMode(true);
        setQuestionIdToEdit(question.id);
        setQuestion(question.text);
        setOptions(
            question.options.map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
            }))
        );
        scrollToTop();
    };

    // Handle delete question
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/questions/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Question deleted successfully");
            fetchQuestions(); // Refresh the question list after deletion
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    // Reset the form after submit or edit cancel
    const resetForm = () => {
        setQuestion("");
        setOptions([
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
        ]);
        setEditMode(false);
        setQuestionIdToEdit(null);
    };

    return (
        <>
            <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
                <Typography variant="h5" align="center">
                    {editMode ? "Edit Question" : "Create a New Quiz Question"}
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        maxWidth: 400, // Set a maximum width for the form
                        margin: "auto", // Center the form
                        mt: 5,
                        p: 2,
                        borderRadius: 1,
                        boxShadow: 1,
                        bgcolor: "ivory",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, textAlign: "center" }}
                    >
                        {editMode ? "Edit Question" : "Create Question"}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                        required
                        sx={{ mb: 2 }}
                    />

                    {options.map((option, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label={`Option ${index + 1}`}
                                value={option.text}
                                onChange={(e) =>
                                    handleOptionChange(
                                        index,
                                        "text",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </Box>
                    ))}

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <label id="correct-answer-label">Correct Answer</label>
                        <Select
                            labelId="correct-answer-label"
                            value={
                                correctAnswerIndex !== null
                                    ? correctAnswerIndex
                                    : ""
                            }
                            onChange={handleCorrectAnswerChange}
                        >
                            {options.map((option, index) => (
                                <MenuItem key={index} value={index}>
                                    {option.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mb: 1 }} // Add some margin below the button
                    >
                        {editMode ? "Update Question" : "Create Question"}
                    </Button>

                    {editMode && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={resetForm}
                            fullWidth
                        >
                            Cancel Edit
                        </Button>
                    )}
                </Box>

                <h3 style={{ marginTop: "30px" }}>Questions List</h3>

                {loading ? (
                    <CircularProgress />
                ) : (
                    questionsList.map((q, index) => (
                        <Card key={q.id} sx={{ bgcolor: "beige", mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">
                                    {index + 1}. {q.text}{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <ul>
                                    {q.options.map((opt) => (
                                        <li key={opt.id}>
                                            {opt.text}{" "}
                                            {opt.isCorrect ? "(Correct)" : ""}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mr: 2 }}
                                    onClick={() => handleEdit(q)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDelete(q.id)}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }} align="center">
                Want to log out?{" "}
                <Link to="#" onClick={handleLogout}>
                    Logout
                </Link>
            </Typography>
        </>
    );
}

export default TeacherDashboard;
