import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Project
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const project = await Project.create({
      title,
      description,
      deadline,
      owner: req.user.id,
      members: [req.user.id]
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get My Projects
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    }).populate("owner", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard overview
router.get("/dashboard", protect , async (req, res) => {
    try {
      // Get user's projects (owner or invited)
      const projects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      }).populate("owner", "name email");
  
      // Get tasks across those projects
      const projectIds = projects.map((p) => p._id);
      const tasks = await Task.find({ project: { $in: projectIds } });
  
      // Count tasks by status
      const statusCounts = {
        ToDo: tasks.filter((t) => t.status === "ToDo").length,
        InProgress: tasks.filter((t) => t.status === "InProgress").length,
        Done: tasks.filter((t) => t.status === "Done").length,
      };
  
      res.json({ projects, tasks, statusCounts });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  
// Update Project (owner only)
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Project (owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await project.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Invite Member
router.post("/:id/invite", protect, async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      await project.save();
    }

    res.json({ message: "User invited", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard Data
router.get("/dashboard", protect, async (req, res) => {
  try {
    // Get user's projects
    const projects = await Project.find({
      members: req.user.id
    }).populate("owner", "name email");

    // Get all tasks from user's projects
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({
      project: { $in: projectIds }
    }).populate("project", "title");

    // Count tasks by status
    const statusCounts = {
      ToDo: tasks.filter(t => t.status === "ToDo").length,
      InProgress: tasks.filter(t => t.status === "InProgress").length,
      Done: tasks.filter(t => t.status === "Done").length,
    };

    res.json({
      projects,
      tasks,
      statusCounts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
