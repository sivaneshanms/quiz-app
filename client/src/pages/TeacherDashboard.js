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
        <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
            <h2>{editMode ? "Edit Question" : "Create a New Quiz Question"}</h2>
            <form onSubmit={handleSubmit}>
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
                    <div key={index}>
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
                            sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                            control={
                                <Radio
                                    checked={option.isCorrect}
                                    onChange={() =>
                                        handleOptionChange(
                                            index,
                                            "isCorrect",
                                            true
                                        )
                                    }
                                />
                            }
                            label="Correct Answer"
                        />
                    </div>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                >
                    {editMode ? "Update Question" : "Create Question"}
                </Button>
                {editMode && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={resetForm}
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        Cancel Edit
                    </Button>
                )}
            </form>

            <h3 style={{ marginTop: "30px" }}>Questions List</h3>

            {loading ? (
                <CircularProgress />
            ) : (
                questionsList.map((q) => (
                    <Card key={q.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{q.text}</Typography>
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

            <Link to="/login">
                <Button variant="contained" sx={{ mt: 2 }}>
                    Login
                </Button>
            </Link>
            <Link to="/questions">
                <Button variant="contained" sx={{ mt: 2, ml: 2 }}>
                    View Questions
                </Button>
            </Link>
            <Link to="/register">
                <Button variant="contained" sx={{ mt: 2, ml: 2 }}>
                    Register
                </Button>
            </Link>
        </Box>
    );
}

export default TeacherDashboard;
