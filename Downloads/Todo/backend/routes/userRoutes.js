// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
// Import from your NEW userController.js
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Make sure path is correct

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;