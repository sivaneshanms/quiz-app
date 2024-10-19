// models/Option.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Question = require("./Question");

const Option = sequelize.define("Option", {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// Association: One question can have many options
Question.hasMany(Option, {
    foreignKey: "questionId",
    as: "options",
    onDelete: "CASCADE",
});
Option.belongsTo(Question, { foreignKey: "questionId", as: "question" });

module.exports = Option;
