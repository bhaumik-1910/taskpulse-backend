require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint (for deployment monitoring)
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "TaskManager API is running",
        timestamp: new Date().toISOString()
    });
});

// Mount Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/posts", postRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });
