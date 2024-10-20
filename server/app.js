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

process.on("unhandledRejection", (reason, promise) => {
    // logger.error(Unhandled Rejection reason: ${reason});
    console.log(`Unhandled Rejection reason: ${reason}`);
    // Close the server
    // server.close(() => {
    //     logger.error("Server closed due to unhandled rejection.");
    //     process.exit(1);
    // });
});

process.on("uncaughtException", (err) => {
    // logger.error(uncaughtException:  ${err.name} - ${err.message});
    console.log(`uncaughtException:  ${err.name} - ${err.message}`);
    ////console.log(`reason:  ${err}`);
    // process.exit(1);
});

sequelize.sync({ alter: true }).then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});
