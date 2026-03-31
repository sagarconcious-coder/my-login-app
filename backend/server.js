console.log("🚀 Starting server...");

const express = require("express");
const cors = require("cors");

const app = express(); // creates your web server
const PORT = process.env.PORT || 5000;

// ── Middleware (runs on every request before routes) ──────────

// Allow requests from any origin (for development/deployment)
app.use(cors());

// Automatically parse JSON request bodies
// Without this: req.body is undefined
// With this: req.body.email works correctly
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────

// Initialize database first
const db = require("./database/init");
console.log("✅ DB loaded");

const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

app.use("/api", apiRoutes);
app.use("/api", authRoutes);
console.log("✅ Routes loaded");

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
