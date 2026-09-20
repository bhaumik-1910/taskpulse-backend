const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Protect all routes with auth middleware
router.use(auth);

// GET /tasks/stats - Get analytics and count summary for the logged-in user
router.get("/stats", async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        const [total, completed, pending, overdue, tasks] = await Promise.all([
            Task.countDocuments({ user: userId }),
            Task.countDocuments({ user: userId, completed: true }),
            Task.countDocuments({ user: userId, completed: false }),
            Task.countDocuments({ user: userId, completed: false, dueDate: { $lt: now } }),
            Task.find({ user: userId }).select("category priority completed")
        ]);

        const categoryCounts = {
            Work: 0,
            Personal: 0,
            Study: 0,
            Health: 0,
            Finance: 0,
            Other: 0
        };

        const priorityCounts = {
            High: 0,
            Medium: 0,
            Low: 0
        };

        tasks.forEach(t => {
            if (categoryCounts[t.category] !== undefined) categoryCounts[t.category]++;
            if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
        });

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        res.json({
            total,
            completed,
            pending,
            overdue,
            completionRate,
            categories: categoryCounts,
            priorities: priorityCounts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /tasks - Fetch all tasks for the logged-in user with filtering, search, and sorting
router.get("/", async (req, res) => {
    try {
        const { category, status, priority, search, sortBy, order } = req.query;
        const query = { user: req.user.id };

        if (category && category !== "All") {
            query.category = category;
        }

        if (status === "completed") {
            query.completed = true;
        } else if (status === "active") {
            query.completed = false;
        }

        if (priority && priority !== "All") {
            query.priority = priority;
        }

        if (search && search.trim() !== "") {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [{ title: regex }, { description: regex }];
        }

        // Sorting options
        let sortOption = { createdAt: -1 };
        const sortOrder = order === "asc" ? 1 : -1;

        if (sortBy === "dueDate") {
            // Null due dates sorted last
            sortOption = { dueDate: sortOrder, createdAt: -1 };
        } else if (sortBy === "priority") {
            sortOption = { priority: sortOrder };
        } else if (sortBy === "title") {
            sortOption = { title: sortOrder };
        } else if (sortBy === "createdAt") {
            sortOption = { createdAt: sortOrder };
        }

        const tasks = await Task.find(query).sort(sortOption);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /tasks/:id - Fetch a single task by ID
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /tasks - Create a new task
router.post("/", async (req, res) => {
    try {
        const { title, description, category, priority, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ msg: "Task title is required" });
        }

        const taskData = {
            title: title.trim(),
            description: description ? description.trim() : "",
            user: req.user.id
        };

        if (category) taskData.category = category;
        if (priority) taskData.priority = priority;
        if (dueDate) taskData.dueDate = new Date(dueDate);

        const newTask = new Task(taskData);
        await newTask.save();

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /tasks/:id - Update an existing task
router.put("/:id", async (req, res) => {
    try {
        const { title, description, category, priority, dueDate, completed } = req.body;
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({ msg: "Title cannot be empty" });
            }
            task.title = title.trim();
        }

        if (description !== undefined) task.description = description.trim();
        if (category !== undefined) task.category = category;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
        if (completed !== undefined) task.completed = Boolean(completed);

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /tasks/:id/toggle - Quick toggle completed state
router.patch("/:id/toggle", async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        task.completed = !task.completed;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        res.json({ msg: "Task deleted successfully", id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
