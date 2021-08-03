const express = require('express');
const router = new express.Router();

const User = require('../controllers/user');
const auth = require('../middlewares/auth');

// @route   GET /users/me
// @desc    Read profile of currently authenticated user
// @access  Private
router.get('/users/me', auth, User.fetch);

// @route   PATCH /users/me
// @desc    Update profile of currently authenticated user
// @access  Private
router.patch('/users/me', auth, User.update);

// @route   DELETE /users/me
// @desc    Delete profile of currently authenticated user
// @access  Private
router.delete('/users/me', auth, User.delete);

module.exports = router;