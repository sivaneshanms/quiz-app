// User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("Teacher", "Student"),
        allowNull: false,
    },
    score: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
});

module.exports = User;
