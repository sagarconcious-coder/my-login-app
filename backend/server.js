const express = require("express");
const cors = require("cors");

const app = express(); // creates your web server
const PORT = 5000;

// ── Middleware (runs on every request before routes) ──────────

// Allow React app on port 3000 to make requests here
app.use(
  cors({
    origin: "https://your-vercel-url.vercel.app",
    credentials: true,
  }),
);

// Automatically parse JSON request bodies
// Without this: req.body is undefined
// With this: req.body.email works correctly
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────

// Initialize database first
const db = require("./database/init");

// All routes in api.js will start with /api
// e.g. /signup inside api.js becomes /api/signup
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
