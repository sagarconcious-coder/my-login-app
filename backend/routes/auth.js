const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/init");

const router = express.Router();

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to generate JWT token
function generateToken(userId, email) {
  const token = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" },
  );
  return token;
}

// ===== REGISTER ENDPOINT =====
// POST /api/auth/register
router.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  // Check if user already exists
  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, existingUser) => {
      if (err) {
        console.error("DB check error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      // Hash password
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("Hash error:", hashErr);
          return res.status(500).json({ error: "Hash error" });
        }

        // Store user in database
        db.run(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hashedPassword],
          function (insertErr) {
            if (insertErr) {
              console.error("Insert error:", insertErr);
              // Handle UNIQUE constraint specifically
              if (insertErr.message.includes("UNIQUE constraint failed")) {
                return res
                  .status(409)
                  .json({ error: "Email already registered" });
              }
              return res.status(500).json({ error: "Registration failed" });
            }

            // Generate JWT token
            const token = generateToken(this.lastID, email);

            res.status(201).json({
              message: "User registered successfully",
              token,
              user: { id: this.lastID, email },
            });
          },
        );
      });
    },
  );
});

// ===== LOGIN ENDPOINT =====
// POST /api/auth/login
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user by email
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      console.error("DB login query error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password with stored hash
    bcrypt.compare(password, user.password, (compareErr, passwordMatch) => {
      if (compareErr) {
        console.error("Password compare error:", compareErr);
        return res.status(500).json({ error: "Auth error" });
      }
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken(user.id, user.email);

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email },
      });
    });
  });
});

module.exports = router;
