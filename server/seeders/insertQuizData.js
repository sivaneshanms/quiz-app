// seeders/insertQuizData.js
const Question = require("../models/Question");
const Option = require("../models/Option");
const sequelize = require("../config/database");

const quizData = [
    {
        question_text:
            "What is the correct way to define a Sequelize model in Node.js?",
        options: [
            {
                text: "sequelize.define('ModelName', { attributes }, { options });",
                isCorrect: true,
            },
            {
                text: "sequelize.model('ModelName', { attributes }, { options });",
                isCorrect: false,
            },
            {
                text: "sequelize.create('ModelName', { attributes }, { options });",
                isCorrect: false,
            },
            {
                text: "sequelize.table('ModelName', { attributes }, { options });",
                isCorrect: false,
            },
        ],
    },
    {
        question_text:
            "How do you create a route in Express to fetch all users from a MySQL database using Sequelize?",
        options: [
            {
                text: "app.get('/users', (req, res) => User.fetchAll());",
                isCorrect: false,
            },
            {
                text: "app.get('/users', (req, res) => User.findAll().then(users => res.json(users)));",
                isCorrect: true,
            },
            {
                text: "app.get('/users', (req, res) => User.find().then(users => res.json(users)));",
                isCorrect: false,
            },
            {
                text: "app.get('/users', (req, res) => User.getAll().then(users => res.json(users)));",
                isCorrect: false,
            },
        ],
    },
    {
        question_text:
            "Which hook in React is used for performing side effects in function components?",
        options: [
            { text: "useContext", isCorrect: false },
            { text: "useReducer", isCorrect: false },
            { text: "useEffect", isCorrect: true },
            { text: "useState", isCorrect: false },
        ],
    },
    {
        question_text:
            "How can you define a one-to-many relationship between two models in Sequelize?",
        options: [
            { text: "ModelA.hasOne(ModelB);", isCorrect: false },
            { text: "ModelA.belongsTo(ModelB);", isCorrect: false },
            { text: "ModelA.belongsToMany(ModelB);", isCorrect: false },
            { text: "ModelA.hasMany(ModelB);", isCorrect: true },
        ],
    },
    {
        question_text:
            "What is the purpose of res.status(500) in an Express.js route?",
        options: [
            {
                text: "To send a success message to the client.",
                isCorrect: false,
            },
            {
                text: "To indicate that the request has been redirected.",
                isCorrect: false,
            },
            {
                text: "To send a server error response to the client.",
                isCorrect: true,
            },
            {
                text: "To send a forbidden access response to the client.",
                isCorrect: false,
            },
        ],
    },
];

const insertQuizData = async () => {
    try {
        await sequelize.sync(); // Ensure tables are created

        for (const data of quizData) {
            const question = await Question.create({
                text: data.question_text,
            });

            for (const option of data.options) {
                await Option.create({
                    text: option.text,
                    isCorrect: option.isCorrect,
                    questionId: question.id, // Associate option with the correct question
                });
            }
        }

        console.log("Quiz data inserted successfully!");
    } catch (error) {
        console.error("Error inserting quiz data:", error);
    } finally {
        sequelize.close();
    }
};

insertQuizData();
