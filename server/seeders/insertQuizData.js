// seeders/insertQuizData.js
const Question = require("../models/Question");
const Option = require("../models/Option");
const sequelize = require("../config/database");

const quizData = [
    {
        question_text:
            "What is the correct way to define a Sequelize model in Node.js?",
        options: [
            "sequelize.define('ModelName', { attributes }, { options });",
            "sequelize.model('ModelName', { attributes }, { options });",
            "sequelize.create('ModelName', { attributes }, { options });",
            "sequelize.table('ModelName', { attributes }, { options });",
        ],
        correct_option: 1,
    },
    {
        question_text:
            "How do you create a route in Express to fetch all users from a MySQL database using Sequelize?",
        options: [
            "app.get('/users', (req, res) => User.fetchAll());",
            "app.get('/users', (req, res) => User.findAll().then(users => res.json(users)));",
            "app.get('/users', (req, res) => User.find().then(users => res.json(users)));",
            "app.get('/users', (req, res) => User.getAll().then(users => res.json(users)));",
        ],
        correct_option: 2,
    },
    {
        question_text:
            "Which hook in React is used for performing side effects in function components?",
        options: ["useContext", "useReducer", "useEffect", "useState"],
        correct_option: 3,
    },
    {
        question_text:
            "How can you define a one-to-many relationship between two models in Sequelize?",
        options: [
            "ModelA.hasOne(ModelB);",
            "ModelA.belongsTo(ModelB);",
            "ModelA.belongsToMany(ModelB);",
            "ModelA.hasMany(ModelB);",
        ],
        correct_option: 4,
    },
    {
        question_text:
            "What is the purpose of res.status(500) in an Express.js route?",
        options: [
            "To send a success message to the client.",
            "To indicate that the request has been redirected.",
            "To send a server error response to the client.",
            "To send a forbidden access response to the client.",
        ],
        correct_option: 3,
    },
];

const insertQuizData = async () => {
    try {
        await sequelize.sync(); // Ensure tables are created

        for (const data of quizData) {
            const question = await Question.create({
                text: data.question_text,
                correct_option: data.correct_option,
            });

            for (const optionText of data.options) {
                await Option.create({
                    text: optionText,
                    questionId: question.id,
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
