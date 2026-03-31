console.log("🚀 Starting server...");

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database ──────────────────────────────────────────────────
require("./database/init");
console.log("✅ DB loaded");

// ── Routes ────────────────────────────────────────────────────
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

app.use("/api", apiRoutes);
app.use("/api", authRoutes);

console.log("✅ Routes loaded");

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ── Frontend (IMPORTANT FIX HERE) ─────────────────────────────
const frontendPath = path.join(__dirname, "../frontend/build");

// Serve static files
app.use(express.static(frontendPath));

// SPA fallback (for React routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

console.log("✅ Frontend static files configured");

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
