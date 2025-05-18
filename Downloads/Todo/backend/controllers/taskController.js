const Task = require('../models/Task'); 

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { text, isImportant, isForToday, dueDate } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  try {
    const task = new Task({
      user: req.user._id,
      text,
      isImportant: Boolean(isImportant) || false, // Coerce to boolean, default to false
      isForToday: Boolean(isForToday) || false,   // Coerce to boolean, default to false
      dueDate: dueDate ? new Date(dueDate) : null,
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a task (e.g., mark as completed)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { text, completed, isImportant, isForToday, dueDate } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = Boolean(completed);
    if (isImportant !== undefined) task.isImportant = Boolean(isImportant);
    if (isForToday !== undefined) task.isForToday = Boolean(isForToday);
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : task.dueDate; // Allow nulling dueDate

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await task.deleteOne(); // Mongoose v6+
    // For older Mongoose: await task.remove();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// ... (getTasks, createTask, updateTask, deleteTask) ...

// @desc    Get tasks marked for today by the logged in user
// @route   GET /api/tasks/today
// @access  Private
const getTodayTasks = async (req, res) => {
  try {
    // Fetch tasks for the user that are marked for today and not yet completed
    // You might want to also include completed ones, or have a filter for that on frontend
    const tasks = await Task.find({
      user: req.user._id,
      isForToday: true,
      // completed: false // Optional: only show active "today" tasks by default
    }).sort({ createdAt: -1 }); // Or sort by other criteria
    res.json(tasks);
  } catch (error) {
    console.error('Get Today Tasks Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get tasks marked as important by the logged in user
// @route   GET /api/tasks/important
// @access  Private
const getImportantTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      isImportant: true,
      // completed: false // Optional: only show active "important" tasks
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get Important Tasks Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTodayTasks,   // Export new function
  getImportantTasks // Export new function
};