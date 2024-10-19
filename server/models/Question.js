// models/Question.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Question = sequelize.define("Question", {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correct_option: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    }
});

// Association: One teacher can create many questions
User.hasMany(Question, { foreignKey: "teacherId", as: "questions" });
Question.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });

module.exports = Question;
