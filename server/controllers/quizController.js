// quizController.js
const Question = require("../models/Question");
const Option = require("../models/Option");

exports.createQuestion = async (req, res) => {
    try {
        const { question_text, options, correct_option } = req.body;

        // Ensure all required fields are provided
        if (
            !question_text ||
            !options ||
            options.length === 0 ||
            correct_option === undefined
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create the question
        const question = await Question.create({
            text: question_text,
            teacherId: req.user.id, // teacher_id from JWT token
        });

        // Create options
        await Promise.all(
            options.map(async (option_text, index) => {
                await Option.create({
                    text: option_text,
                    isCorrect: index === correct_option, // Mark the correct option
                    questionId: question.id,
                });
            })
        );

        res.status(201).json({
            message: "Question and options created successfully",
            question,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating question" });
    }
};
