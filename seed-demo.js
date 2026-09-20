require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Task = require("./models/Task");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskmanagerdb";

async function seed() {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);

    const demoEmail = "demo@taskpulse.app";
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
        const hashedPassword = await bcrypt.hash("demo123456", 10);
        user = new User({
            name: "Demo Evaluator",
            email: demoEmail,
            password: hashedPassword
        });
        await user.save();
        console.log("Created demo user:", demoEmail);
    } else {
        console.log("Found existing demo user:", demoEmail);
    }

    // Clear existing tasks for demo user to seed fresh, attractive data
    await Task.deleteMany({ user: user._id });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    const yesterday = new Date(Date.now() - 86400000 * 2);
    const tomorrow = new Date(Date.now() + 86400000);
    const nextWeek = new Date(Date.now() + 86400000 * 5);

    const demoTasks = [
        {
            title: "Prepare Capstone Presentation Slides",
            description: "Structure presentation according to Day 20 guidelines: architecture, live demo, challenges, and future scope.",
            category: "Work",
            priority: "High",
            dueDate: today,
            completed: false,
            user: user._id
        },
        {
            title: "Deploy Backend API to Render",
            description: "Connect MongoDB Atlas database and configure JWT_SECRET environment variables on Render dashboard.",
            category: "Work",
            priority: "High",
            dueDate: yesterday, // Overdue example
            completed: false,
            user: user._id
        },
        {
            title: "Study Mongoose Schema Indexing & Pipelines",
            description: "Review composite indexes ({ user: 1, completed: 1 }) and aggregation performance benchmarks.",
            category: "Study",
            priority: "Medium",
            dueDate: tomorrow,
            completed: false,
            user: user._id
        },
        {
            title: "Deploy Frontend Client to Netlify",
            description: "Configure static deployment with custom domain and ensure API_BASE points to the live Render endpoint.",
            category: "Work",
            priority: "High",
            dueDate: tomorrow,
            completed: true, // Completed example
            user: user._id
        },
        {
            title: "Review Monthly Cloud Hosting Budget",
            description: "Estimate Render & Atlas usage costs for portfolio applications and free-tier limits.",
            category: "Finance",
            priority: "Low",
            dueDate: nextWeek,
            completed: false,
            user: user._id
        },
        {
            title: "Record 2-Minute Capstone Walkthrough Video",
            description: "Screen recording demonstrating signup, login, CRUD operations, filtering, and responsive mobile view.",
            category: "Study",
            priority: "High",
            dueDate: nextWeek,
            completed: false,
            user: user._id
        },
        {
            title: "Morning 5K Jog & Stretching",
            description: "Stay energetic for capstone demo day!",
            category: "Health",
            priority: "Low",
            dueDate: null,
            completed: true,
            user: user._id
        }
    ];

    await Task.insertMany(demoTasks);
    console.log(`Seeded ${demoTasks.length} demo tasks successfully.`);

    const count = await Task.countDocuments({ user: user._id });
    console.log("Total tasks for demo user:", count);

    await mongoose.disconnect();
    console.log("Database disconnected. Seeding complete!");
}

seed().catch(err => {
    console.error("Seed error:", err);
    process.exit(1);
});
