// app.js
const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const Option = require("./models/Option"); // Add this to sync the Option model
const Question = require("./models/Question"); // Add this to sync the Question model
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api", quizRoutes);

sequelize.sync({ alter: true }).then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});
