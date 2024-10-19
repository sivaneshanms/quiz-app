// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateJWT = (req, res, next) => {
    console.log('came in auth')

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token is required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info (id, role) to the request
        next();
    } catch (error) {
        console.log('error', error)
        res.status(401).json({ message: "Invalid or expired token" });
    }
}; 

exports.isTeacher = (req, res, next) => {
    if (req.user.role !== "Teacher") {
        return res
            .status(403)
            .json({ message: "Access restricted to teachers" });
    }
    next();
};
