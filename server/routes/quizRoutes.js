// routes/quizRoutes.js
const express = require("express");
const Question = require("../models/Question"); // Import models
const Option = require("../models/Option");
const { authenticateJWT } = require("../middlewares/authMiddleware"); // Middleware to check JWT
const User = require("../models/User");
const { where, Sequelize } = require("sequelize");

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

    res.json({
        role: req.user.role,
        questions: [question],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// routes/questionRoutes.js
// Update question (Teacher-only)
router.put('/questions/:id', authenticateJWT, async (req, res) => {
  console.log('req.body in update', req.body)

  if (req.user.role !== 'Teacher') {
    console.log('req.user.role', req.user.role)
    return res.status(403).json({ message: "Only teachers can update questions" });
  }

  const { text, options, correctOptionId, isCorrect } = req.body;
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);
    console.log('question', question)
    if (!question) {
      return res.status(404).json({ message: 'Question not found or unauthorized' });
    }

    await question.update({ text, correct_option: correctOptionId });

    // Update options (replace all options)
    await Option.destroy({ where: { questionId: id } });
    console.log('Option')
    await Promise.all(
      options.map(optionText => {
        console.log('optionText', optionText)
        Option.create({
          text: optionText,
          questionId: id,
          isCorrect
        })
      }
      )
    );
    console.log('done);')

    res.json({ message: "Question updated successfully", question });
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'Error updating question', error });
  }
});

// routes/questionRoutes.js
// Delete question (Teacher-only)
router.delete('/questions/:id', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'Teacher') {
    return res.status(403).json({ message: "Only teachers can delete questions" });
  }

  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);
    console.log('question', question)
    if (!question) {
        console.log('req.user.id', req.user.id)
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.destroy();
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Get a single question with its options
router.get('/questions', authenticateJWT, async (req, res) => {
    console.log('came in')
  try {
      const questions = await Question.findAll({
          include: [{ model: Option, as: "options" }], // Include associated options
      });


      if (!questions) {
          return res.status(404).json({ message: "Questions not found" });
      }
      
      const shuffledQuestions = shuffle(questions);

      // Send back the shuffled questions along with the user role
      res.json({
          role: req.user.role,
          questions: shuffledQuestions,
      });
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
        let correctAnswers = {};

        // Loop through submitted answers and calculate score
        for (const answer in answers) {
            console.log('answer', answer)
            const question = await Question.findByPk(answer,{
                include: [{ model: Option, as: "options" }], // Ensure options are included
            });

            console.log("question", question.options);


            // Find correct answer for the question
            const correctOption = question?.options?.find(
                (option) => option.isCorrect
            );
                            console.log("correctOption", correctOption?.dataValues);

            if (correctOption && correctOption.id == answers[answer]) {
                score++;
            }
            correctAnswers[answer] = correctOption.id;
            console.log('correctAnswers', correctAnswers)
        }
        await User.update({score}, { where: { id: req.user.id} })

        res.json({ message: "Quiz submitted", score, correctAnswers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting quiz" });
    }
});

router.get("/leaderboard", authenticateJWT, async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                role: 'Student'
            },
            attributes: ["id", "username", "score"], // Adjust based on your User model attributes
            order: [["score", "DESC"]], // Order by score descending
        });

        res.json({users,user:req.user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
});


module.exports = router;
