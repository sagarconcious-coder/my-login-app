const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/init");

const router = express.Router();

// ===== PROTECTED DASHBOARD ROUTE =====
// GET /api/dashboard
// Requires: Authorization: Bearer <token>
router.get("/dashboard", (req, res) => {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    const user = decoded;

    res.json({
      message: "Welcome to your dashboard!",
      user: { id: user.userId, email: user.email },
      data: {
        totalUsers: db.prepare("SELECT COUNT(*) as count FROM users").get()
          .count,
        userCreatedAt: db
          .prepare("SELECT created_at FROM users WHERE id = ?")
          .get(user.userId)?.created_at,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
