// backend/controllers/userController.js
const User = require('../models/User'); // Make sure this path is correct for your User model
const asyncHandler = require('express-async-handler'); // Optional: or use try-catch blocks

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            dob: user.dob,
            profilePictureUrl: user.profilePictureUrl,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob ? new Date(req.body.dob) : user.dob;
        
        // The profilePictureUrl is sent from the client after it uploads to Cloudinary
        if (req.body.profilePictureUrl !== undefined) { 
            user.profilePictureUrl = req.body.profilePictureUrl;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            dob: updatedUser.dob,
            profilePictureUrl: updatedUser.profilePictureUrl,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { getUserProfile, updateUserProfile };