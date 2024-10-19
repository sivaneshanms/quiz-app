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
} from "@mui/material";
import axios from "axios";

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Fetch the questions from the backend
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
                setQuestions(response.data);
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
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3001/api/submit-quiz",
                {
                    answers,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
                    },
                }
            );
            setSubmitted(true);
            console.log("Submitted successfully:", response.data);
        } catch (error) {
            console.error("Error submitting answers:", error);
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
        <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
            {questions.map((question, index) => (
                <Card key={question.id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6">{index+1}. {question.text}</Typography>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                Choose one option
                            </FormLabel>
                            <RadioGroup
                                value={answers[question.id] || ""}
                                onChange={(e) =>
                                    handleOptionChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                            >
                                {question.options.map((option, index) => (
                                    <FormControlLabel
                                        key={option.id}
                                        value={index+1} // RadioGroup expects strings
                                        control={<Radio />}
                                        label={option.text}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </CardContent>
                </Card>
            ))}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                // disabled={submitted}
            >
                {submitted ? "Submitted" : "Submit Answers"}
            </Button>

            {submitted && (
                <Typography
                    variant="h6"
                    sx={{ mt: 3, textAlign: "center", color: "green" }}
                >
                    Quiz submitted successfully!
                </Typography>
            )}
        </Box>
    );
};

export default QuestionsList;
