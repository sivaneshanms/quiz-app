// routes/authRoutes.js
const express = require("express");
const { register, login, getUserList } = require("../controllers/authController");
const User = require("../models/User");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);



module.exports = router;
