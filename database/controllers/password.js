const User = require('../models/user');
const { sendEmail } = require('../utils/index');
const keys = require('../../configs/keys');

// @route POST /auth/recover
// @desc Recover Password - Generate password reset token and send password reset email
// @access Public
exports.recover = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

        // Generate and set password reset token
        user.generatePasswordResetToken();

        // Save the updated user object
        await user.save();

        // Send email
        let subject = "Password change request";
        let to = user.email;
        console.log("fromEmail", keys.fromEmail);
        let from = keys.fromEmail;
        let link = "http://" + req.headers.host + "/auth/reset/" + user.resetPasswordToken;
        let html = `<p>Hi ${user.username}</p>
                    <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

        await sendEmail({to, from, subject, html});

        res.status(200).json({ message: 'A reset email has been sent to ' + user.email + '.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
};

// @route GET /auth/reset/:token
// @desc Validate password reset token and show the password reset view
// @access Public
exports.reset = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()} });

        if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });

        // Redirect user to form with the email address
        res.render('reset', { user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route POST /auth/reset/:token
// @desc Confirm and reset password
// @access Public
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()} });

        if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });

        // Set the new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.isVerified = true;

        // Save the updated user object
        await user.save();

        let subject = "Your password has been changed";
        let to = user.email;
        let from = keys.fromEmail;
        let html = `<p>Hi ${user.username}</p>
                    <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`

        await sendEmail({to, from, subject, html});

        res.status(200).json({ message: 'Your password has been updated.' });

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};