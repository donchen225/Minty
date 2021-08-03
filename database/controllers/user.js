const User = require('../models/user');
const { uploader, sendEmail } = require('../utils/index');

// @route   GET /users/me
// @desc    Read profile of currently authenticated user
// @access  Private
exports.fetch = async (req, res) => { // This will run auth middleware first then if next was called, run route handler 
    res.send({ user: req.user.getPublicProfile(), token: req.token }); // No need to fetch user again as user has already been set to req object when auth was called 
}

// @route   PATCH /users/me
// @desc    Update profile of currently authenticated user
// @access  Private
exports.update = async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["lastName", "firstName", "email", "password"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }
    try {        
        // This will update each property of user that needs to be updated
        updates.forEach((update) => { 
            req.user[update] = req.body[update];
        });
        // This will update user document in database
        await req.user.save(); 
        res.send({ user: req.user.getPublicProfile(), token: req.token });
    } catch (err) {
        next(err);
    }
}

// @route   DELETE /users/me
// @desc    Delete profile of currently authenticated user
// @access  Private
exports.delete = async (req, res, next) => {
    try {
        // This will delete user document from database
        await req.user.deleteOne();
        res.send({ user: req.user.getPublicProfile(), token: req.token });
    } catch (err) {
        next(err)
    }
}