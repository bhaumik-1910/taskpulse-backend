const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters"]
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        category: {
            type: String,
            enum: ["Work", "Personal", "Study", "Health", "Finance", "Other"],
            default: "Work"
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        dueDate: {
            type: Date,
            default: null
        },
        completed: {
            type: Boolean,
            default: false
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

// Compound index for user tasks filtered by completion and sorted by due date
taskSchema.index({ user: 1, completed: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
