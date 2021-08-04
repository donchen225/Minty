const User = require('../models/user');
const Token = require('../models/token');
const { sendEmail } = require('../utils/index');
const keys = require('../../configs/keys');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(keys.GOOGLE_CLIENT_ID);

// @route   POST /users
// @desc    Signup user and create new user profile
// @access  Public
exports.register = async (req, res, next) => {
    try {
        // Create and save user document
        const user = new User(req.body);
        await user.save();
        // Send verification email to user
        await sendVerificationEmail(user, req, res);
    } 
    catch (err) {
        console.log("name", err.name);
        console.log("code", err.code);
        next(err);
    }
}

// @route   POST api/users/login
// @desc    Login user
// @access  Public
exports.login = async (req, res, next) => {
    try {
        // Find user with input email and check if password matches the hashed password stored in db 
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // Authenticate user 
        const token = await user.generateAuthToken();
        // Make sure the user has been verified
        if (!user.isVerified) return res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });
        res.status(200).send({ user: user.getPublicProfile(), token }); // This will send back only specific user data to client. The user's password and tokens array should never be sent back to client even if client is authenticated. The token will be sent back to client so client can now use it to make other requests that require authentication
    } catch (err) {
        next(err);
    }
}

// ===EMAIL VERIFICATION
// @route GET /verify/:token
// @desc Verify user
// @access Public
exports.verify = async (req, res, next) => {
    if(!req.params.token) return res.status(400).json({ message: "We were unable to find a user for this token." });
    try {
        // Find matching verification token document
        const token = await Token.findOne({ token: req.params.token });
        
        if (!token) return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
        // Find user with given user id 
        await User.findOne({ _id: token.userId }, (user) => {
            if (!user) return res.status(400).json({ message: 'We were unable to find a user for this token.' });
            // Make sure the user is not already verified
            if (user.isVerified) return res.status(400).json({ message: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) return res.status(500).json({ message: err.message });

                res.status(200).send({ message: "The account has been verified. Please log in." });
            });
        });
        // Delete all token documents with given user id from database
        Token.deleteMany({ _id: token.userId }, (err) => {
            if (err) return res.status(500).json({ message: err.message });
        });
    } catch (err) {
        next(err)
    }
}

// @route POST /auth/resend
// @desc Resend Verification Email
// @access Public
exports.resendToken = async (req, res, next) => {
    try {
        const { email } = req.body;
        // Find user with given email 
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
        
        // Check if user has already been verified
        if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.'});

        // Send email to verify user 
        await sendVerificationEmail(user, req, res);
    } catch (err) {
        next(err);
    }
};

// This async function will be used to generate a verification token for a user and send a verification email to their email
async function sendVerificationEmail (user, req, res) {
    console.log("sendVerificationEmail is called");
    try {
        console.log("user", user);
        // Generate verification token 
        const token = user.generateVerificationToken();

        // Save the verification token
        await token.save();

        // Send verification email to user's email 
        let subject = "Account Verification token";
        let to = user.email;
        let from = keys.fromEmail;
        let link="http://"+req.headers.host+"/verify/"+token.token;
        let html = 
            `<p>Hi ${user.firstName} ${user.lastName} <p><br>
            <p>Please click on the following <a href="${link}">link</a> to verify your account.</p><br>
            <p>If you did not request this, please ignore this email.</p>`;

        await sendEmail({ to, from, subject, html });

        res.status(200).json({ message: 'A verification email has been sent to ' + user.email + '.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 

// @route   POST /auth/google
// @desc    Authorize Google 
// @access  Private
exports.googleAuth = async (req, res, next) => {
    try {
        const { googleTokenId } = req.body;
        // Verify Google-provided id token is valid
        const ticket = await client.verifyIdToken({
            idToken: googleTokenId,
            audience: keys.GOOGLE_CLIENT_ID
        });
        console.log("ticket payload", ticket.getPayload());

        const { family_name, given_name, email, picture } = ticket.getPayload();
        // If Google-provided id token is valid, update or create a matching user doc in db
        const user = await User.findOneAndUpdate({ email: email }, { firstName: given_name, lastName: family_name, picture: picture }, { new: true, upsert: true, useFindAndModify: false });
        
        const token = await user.generateAuthToken();

        res.status(200).send({ user: user.getPublicProfile(), token });
    } catch (err) {
        next(err);
    }
}

// @route   POST /users/logout
// @desc    Logout currently authenticated user of current session
// @access  Private
exports.logout = async (req, res, next) => {
    try { // No need to fetch user again as currently authenticated user has already been set to req object when auth was called
        console.log("req token", req.token);
        // This will remove the currently authenticated user's current session token from the user's tokens' array
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token; 
        })
        // This will update user document in database    
        await req.user.save();
        res.status(201).send({ success: true });
    } catch (err) {
        next(err);
    }
}

// @route   POST /auth/remove
// @desc    Logout a specific user of a specific session
// @access  Public
exports.removeAuthToken = async (req, res, next) => {
    try { 
        const { auth_token, id_token } = req.body;
        // Fetch user from database
        const user = await User.findOne({ _id: id_token }); 
        // This will remove a user's current session token from their tokens' array
        user.tokens = user.tokens.filter((token) => { 
            return token.token !== auth_token; 
        });
        // This will update user document in database 
        await user.save();
        res.status(201).send({ success: true });
    } catch (err) {
        next(err);
    }
}

// @route   POST /users/logoutAll
// @desc    Logout currently authenticated user of all sessions
// @access  Private
exports.logoutAll = async (req, res, next) => {
    try {
        // This will remove all of the currently authentictaed user's session tokens from their tokens' array
        req.user.tokens = [];
         // This will update user document in database 
        await req.user.save();
        res.status(201).send({ success: true });
    } catch (e) {
        next(err);
    }
}
