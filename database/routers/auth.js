const express = require('express');
const router = new express.Router();
const { check } = require('express-validator');

const Auth = require('../controllers/auth');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// @route   POST /users
// @desc    Signup user and create new user profile
// @access  Public
router.post('/users', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 8 chars long'),
    check('firstName').not().isEmpty().withMessage('Your first name is required'),
    check('lastName').not().isEmpty().withMessage('Your last name is required')
], validate, Auth.register);

// @route   POST /users/login
// @desc    Login user
// @access  Public
router.post('/users/login', [
    check('email').isEmail().withMessage('Enter a valid email addresss'),
    check('password').not().isEmpty()
], validate, Auth.login);

// @route   POST /auth/google
// @desc    Authorize Google 
// @access  Private
router.post('/auth/google', Auth.googleAuth);

// ===EMAIL VERIFICATION
// @route GET /verify/:token
// @desc Verify user
// @access Public
router.get('/verify/:token', Auth.verify);

// @route POST /auth/resend
// @desc Resend Verification Email
// @access Public
router.post('/auth/resend', Auth.resendToken);

// @route   POST /auth/remove
// @desc    Logout a specific user of a specific session
// @access  Public
router.post('/auth/remove', Auth.removeAuthToken);

// @route   POST /users/logout
// @desc    Logout currently authenticated user of current session
// @access  Private
router.post('/users/logout', auth, Auth.logout);

// @route   POST /users/logoutAll
// @desc    Logout currently authenticated user of all sessions
// @access  Private
router.post('/users/logoutAll', auth, Auth.logoutAll);

module.exports = router;