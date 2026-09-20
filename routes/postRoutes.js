const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// GET - public list of all posts, newest first, with author name attached
router.get("/", async (req, res) => {
    const posts = await Post.find().populate("author", "name").sort({ createdAt: -1 });
    res.json(posts);
});

// GET - the logged-in user's own posts, for their dashboard.
// Declared before "/:id" so Express doesn't treat "mine" as a post ID.
router.get("/mine", auth, async (req, res) => {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
});

// GET - a single public post (for the full read view)
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "name");
        if (!post) return res.status(404).json({ msg: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(400).json({ msg: "Invalid post ID" });
    }
});

// POST - create a post (auth required)
router.post("/", auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ msg: "Title and content are required" });
        }

        const post = await Post.create({ title, content, author: req.user.id });
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// PUT - edit a post (only its own author may edit)
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, author: req.user.id },
            { title, content },
            { new: true, runValidators: true }
        );

        if (!post) return res.status(404).json({ msg: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// DELETE - remove a post (only its own author may delete)
router.delete("/:id", auth, async (req, res) => {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json({ msg: "Post deleted" });
});

module.exports = router;
