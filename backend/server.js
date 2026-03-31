console.log("🚀 Starting server...");

const express = require("express");
const cors = require("cors");

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

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
