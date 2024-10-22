import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [role, setRole] = useState(""); // Role state to track user role
    const [submittedAnswers, setSubmittedAnswers] = useState({}); // To track the submitted answers
    const [leaderboard, setLeaderboard] = useState([]); // State for leaderboard
    const [currentUser, setCurrentUser] = useState({})
    const [score, setScore] = useState(null)

    useEffect(() => {
        // Fetch the questions and user role from the backend
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/questions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
                        },
                    }
                );

                setRole(response.data.role);
                setQuestions(response.data.questions);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    const handleOptionChange = (questionId, optionId) => {
        setAnswers({
            ...answers,
            [questionId]: optionId,
        });
    };

    const handleLogout = () => {
        // Clear the stored token (JWT) and role from localStorage or context
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Redirect the user to the login page
        window.location.href = "/login";
    };

    const handleSubmit = async () => {
        try {

            const allAnswered = questions.every((question) =>
                answers.hasOwnProperty(question.id)
            );

            if (!allAnswered) {
                alert("Please answer all the questions before submitting.");
                return; // Prevent submission if not all questions are answered
            }
            const token = localStorage.getItem("token");
            const response = await axios.post(
               `${process.env.REACT_APP_API_URL}/submit-quiz`,
                { answers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
                    },
                }
            );
            setSubmitted(true);
            setSubmittedAnswers(response.data.correctAnswers); // Assume the backend returns correct answers in response
            fetchLeaderboard();
            setScore(response.data.score);
            scrollToTop();
        } catch (error) {
            console.error("Error submitting answers:", error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/leaderboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLeaderboard(response.data.users);
            setCurrentUser(response.data.user);

        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/questions/${questionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setQuestions(
                questions.filter((question) => question.id !== questionId)
            );
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // This adds smooth scrolling
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {submitted && (
                <Typography
                    variant="h6"
                    sx={{ mt: 3, textAlign: "center", color: "green" }}
                >
                    Quiz submitted successfully!
                </Typography>
            )}

            {score && score < 3 && (
                <Typography
                    variant="h6"
                    sx={{ mt: 2, textAlign: "center", color: "orange" }}
                >
                    Keep practicing! You can improve your score.
                </Typography>
            )}

            {score && score > 2 && score < 5 && (
                <Typography
                    variant="h6"
                    sx={{ mt: 2, textAlign: "center", color: "blue" }}
                >
                    Good job! You have a decent understanding of the material.
                </Typography>
            )}

            {score && score >= 5 && (
                <Typography
                    variant="h6"
                    sx={{ mt: 2, textAlign: "center", color: "green" }}
                >
                    Excellent work! You're mastering the material!
                </Typography>
            )}

            {/* Leaderboard Table */}
            {submitted && (
                <>
                    <Typography
                        variant="h5"
                        sx={{ mt: 3, textAlign: "center" }}
                    >
                        Leaderboard
                    </Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Rank</TableCell>
                                    <TableCell align="center">
                                        Username
                                    </TableCell>
                                    <TableCell align="center">Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.map((user, index) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{
                                            backgroundColor:
                                                user.id === currentUser.id
                                                    ? "lightblue"
                                                    : "inherit", // Highlight the current user's row
                                            fontWeight:
                                                user.id === currentUser.id
                                                    ? "bold"
                                                    : "normal",
                                        }}
                                    >
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.username}
                                            {user.id === currentUser.id &&
                                                " (You)"}
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.score}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <h3 style={{ marginTop: "30px" }} align="center">
                Full Stack Developer Quiz
            </h3>

            <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
                {questions.map((question, index) => {
                    const selectedAnswer = answers[question.id]; // User's selected answer
                    const correctAnswer = submittedAnswers[question.id]; // Correct answer after submission

                    return (
                        <Card key={question.id} sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6">
                                    {index + 1}. {question.text}{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                        Choose one option
                                    </FormLabel>
                                    <RadioGroup
                                        value={selectedAnswer || ""}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                question.id,
                                                e.target.value
                                            )
                                        }
                                        disabled={submitted} // Disable inputs after submission
                                    >
                                        {question.options.map((option) => (
                                            <FormControlLabel
                                                key={option.id}
                                                value={option.id.toString()}
                                                control={<Radio />}
                                                label={option.text}
                                                sx={{
                                                    // Highlight the correct and selected answers after submission
                                                    color:
                                                        submitted &&
                                                        option.id ===
                                                            parseInt(
                                                                correctAnswer
                                                            )
                                                            ? "green"
                                                            : submitted &&
                                                              selectedAnswer ===
                                                                  option.id
                                                            ? "red"
                                                            : "inherit",
                                                }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                {/* Show correct answer and user's selected answer after submission */}
                                {submitted && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                selectedAnswer == correctAnswer
                                                    ? "green"
                                                    : "red",
                                            mt: 1,
                                        }}
                                    >
                                        {selectedAnswer == correctAnswer
                                            ? "You selected the correct answer!"
                                            : `You selected: ${
                                                  question.options.find(
                                                      (option) =>
                                                          option.id ===
                                                          parseInt(
                                                              selectedAnswer
                                                          )
                                                  )?.text
                                              }. Correct answer: ${
                                                  question.options.find(
                                                      (option) =>
                                                          option.id ===
                                                          parseInt(
                                                              correctAnswer
                                                          )
                                                  )?.text
                                              }`}
                                    </Typography>
                                )}
                            </CardContent>

                            {/* Conditionally render Edit/Delete buttons if the user is a Teacher */}
                            {role === "Teacher" && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 2,
                                        p: 2,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() =>
                                            handleDeleteQuestion(question.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                    <Button variant="contained" color="primary">
                                        Edit
                                    </Button>
                                </Box>
                            )}
                        </Card>
                    );
                })}

                {role !== "Teacher" && !submitted && (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Submit Answers
                    </Button>
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
};

export default QuestionsList;
