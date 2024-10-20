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

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [role, setRole] = useState(""); // Role state to track user role
    const [submittedAnswers, setSubmittedAnswers] = useState({}); // To track the submitted answers
    const [leaderboard, setLeaderboard] = useState([]); // State for leaderboard
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        // Fetch the questions and user role from the backend
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:3001/api/questions",
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
                "http://localhost:3001/api/submit-quiz",
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
        } catch (error) {
            console.error("Error submitting answers:", error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:3001/api/leaderboard",
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
                `http://localhost:3001/api/questions/${questionId}`,
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

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Leaderboard Table */}
            <Typography variant="h5" sx={{ mt: 3, textAlign: "center" }}>
                Leaderboard
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Rank</TableCell>
                            <TableCell align="center">Username</TableCell>
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
                                    {user.id === currentUser.id && " (You)"}
                                </TableCell>
                                <TableCell align="center">
                                    {user.score}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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

                {submitted && (
                    <Typography
                        variant="h6"
                        sx={{ mt: 3, textAlign: "center", color: "green" }}
                    >
                        Quiz submitted successfully!
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default QuestionsList;
