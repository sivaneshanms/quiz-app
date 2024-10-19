// routes/quizRoutes.js
const express = require("express");
const Question = require("../models/Question"); // Import models
const Option = require("../models/Option");
const { authenticateJWT } = require("../middlewares/authMiddleware"); // Middleware to check JWT

const router = express.Router();

// Create a new question with multiple options
router.post("/questions", authenticateJWT, async (req, res) => {
    try {
        const { text, options } = req.body;

        // Check if user is a teacher
        if (req.user.role !== "Teacher") {
            return res
                .status(403)
                .json({
                    message:
                        "Access denied. Only teachers can create questions.",
                });
        }

        // Create the question
        const question = await Question.create({
            text,
            teacherId: req.user.id, // Link question to teacher
        });

        // Create the options for the question
        const optionsToCreate = options.map((option) => ({
            ...option,
            questionId: question.id, // Link option to question
        }));

        await Option.bulkCreate(optionsToCreate); // Bulk insert all options

        res.status(201).json({
            message: "Question created successfully",
            question,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating question" });
    }
});

// routes/quizRoutes.js

// Get a single question with its options
router.get('/questions/:id', authenticateJWT, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [{ model: Option, as: 'options' }], // Include associated options
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Get a single question with its options
router.get('/questions', authenticateJWT, async (req, res) => {
    console.log('came in')
  try {
    const question = await Question.findAll({
      include: [{ model: Option, as: 'options' }], // Include associated options
    });

    if (!question) {
      return res.status(404).json({ message: 'Questions not found' });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Endpoint to submit quiz answers
router.post("/submit-quiz", authenticateJWT, async (req, res) => {
    const { answers } = req.body; // { questionId, selectedOption }

    try {
        let score = 0;

        // Loop through submitted answers and calculate score
        for (const answer in answers) {
            console.log('answer', answers[answer])
            const question = await Question.findOne({
                where: {
                    id: answer,
                    correct_option: answers[answer],
                },
                include: [{ model: Option, as: "options" }],
            });

                            console.log("question", question);


            // Find correct answer for the question
            // const correctOption = question?.options?.find(
            //     (option) => option.isCorrect
            // );
            //                 console.log("correctOption", correctOption);

            if (question) {
                score++;
            }
        }

        res.json({ message: "Quiz submitted", score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting quiz" });
    }
});


module.exports = router;
