const express = require('express');
const router = express.Router(); // <--- ADD THIS LINE

// ... your other require statements like controllers and middleware ...
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTodayTasks,
  getImportantTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// NOW you can use router:
router.route('/').get(protect, getTasks).post(protect, createTask);
router.get('/today', protect, getTodayTasks);
router.get('/important', protect, getImportantTasks);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;