import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Task
router.post("/", protect, async (req, res) => {
    try {
        const { projectId, title, description, assignee, status, priority, dueDate } = req.body;
        
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (!project.members.includes(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    const task = await Task.create({
      project: projectId,
      title,
      description,
      assignee,
      status,
      priority,
      dueDate,
    });

    // Emit real-time update
    const io = req.app.get("io");
    io.to(projectId).emit("taskCreated", task);

    res.json(task);
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

// Search Tasks
router.get("/search", protect, async (req, res) => {
  try {
    const { q, status, priority } = req.query;
    console.log('Search request:', { q, status, priority, userId: req.user.id });
    
    // Build search query
    let query = {};
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    // Priority filter
    if (priority) {
      query.priority = priority;
    }
    
    // Get user's projects first
    const userProjects = await Project.find({ members: req.user.id });
    const projectIds = userProjects.map(p => p._id);
    console.log('User projects:', projectIds);
    
    // Only search tasks from user's projects
    query.project = { $in: projectIds };
    
    console.log('Final query:', query);
    
    const tasks = await Task.find(query)
      .populate("assignee", "name email")
      .populate("project", "title");
    
    console.log('Found tasks:', tasks.length);
    res.json(tasks);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: err.message });
  }
});
  

// Get Tasks for a Project
router.get("/:projectId", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!project.members.includes(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    const tasks = await Task.find({ project: req.params.projectId }).populate("assignee", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Not found" });

    if (!task.project.members.includes(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(task, req.body);
    await task.save();
    
    // Emit real-time update
    const io = req.app.get("io");
    io.to(task.project._id.toString()).emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Not found" });

    if (!task.project.members.includes(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    const projectId = task.project._id.toString();
    await task.deleteOne();
    
    // Emit real-time update
    const io = req.app.get("io");
    io.to(projectId).emit("taskDeleted", { taskId: req.params.id });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Comment
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Not found" });

    if (!task.project.members.includes(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    task.comments.push({ user: req.user.id, text: req.body.text });
    await task.save();
    
    // Emit real-time update
    const io = req.app.get("io");
    io.to(task.project._id.toString()).emit("commentAdded", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
