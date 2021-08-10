const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Token = require('./token');
const Institution = require('./institution');
const Account = require('./account');
const Transaction = require('./transaction');
const keys = require('../../configs/keys');

// This mongoose schema validator is to ensure password does not include password and meets complexity requirement 
const passwordValidators = [
    { 
        validator: function(value) {
            return !value.toLowerCase().includes("password")
        },
        message: "Password cannot contain password"
    },
    {
        validator: function(value) {
            return value.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        },
        message: 'Password must meet complexity requirement'
    },

];

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String, // mongoose schema validation
        required: [ true, 'Enter your first name'], 
        trim: true
    },
    lastName: {
        type: String,
        required: [ true, 'Enter your last name'],
        trim: true
    },
    email: {
        type: String,
        unique: [ true, 'That email address is taken' ], 
        required: [ true, 'Enter an email address' ],
        trim: true,
        lowercase: true,
        validate: [ validator.isEmail, 'Enter a valid email address' ]
    },
    password: {
        type: String,
        required: false,
        required: [ true, 'Enter a password' ],
        minlength: [ 8, 'Password should be at least 8 characters' ],
        trim: true,
        validate: passwordValidators
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }, 
    tokens: [{ // Tokens field will be an array of token objects. This will store all valid JSON tokens
        token: { 
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// This will define a populated virtual, telling Mongoose to populate docs from 'Token' model whose foreignField (ownerId) matches the user document's localField (_id)    
UserSchema.virtual('token', { 
    ref: 'Token', 
    localField: '_id',
    foreignField: 'ownerId'
}) 

// This will define a populated virtual, telling Mongoose to populate docs from 'Transaction' model whose foreignField (ownerId) matches the user document's localField (_id)    
UserSchema.virtual('transaction', { 
    ref: 'Transaction', 
    localField: '_id', // Find users where `localField`
    foreignField: 'ownerId' // is equal to `foreignField`
}) 

// This will define a populated virtual, telling Mongoose to populate docs from 'Institution' model whose foreignField (ownerId) matches the user document's localField (_id) 
UserSchema.virtual('institution', {
    ref: 'Institution',
    localField: '_id',
    foreignField: 'ownerId'
})

// This will define a populated virtual, telling Mongoose to populate docs from 'Account' model whose foreignField (ownerId) matches the user document's localField (_id) 
UserSchema.virtual('account', {
    ref: 'Account',
    localField: '_id',
    foreignField: 'ownerId'
})

// Privatize the password and tokens array
UserSchema.methods.getPublicProfile = function () {
    console.log("getPublicProfile is called");
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

// Hash the plain test password using the bcrypt package whenever user's password changes before saving in the database
UserSchema.pre('save', async function (next) {
    console.log("pre-save user function is called");
    const user = this;
    if (user.isModified('password')) { // Password will be modified when user is first created or password is changed
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

// Generate an authentication token using the jwt package and add it to user's tokens array. This token will be returned to the client and will be required for accessing protected routes.
UserSchema.methods.generateAuthToken = async function () {
    console.log("generateAuthToken is called");
    const user = this;
    // Generate jwt token with preset expiration of 30 min 
    const token = jwt.sign({ _id: user._id.toString() }, keys.JWT_SECRET, { expiresIn: '30min' }); 
    // Keep track of all user's authentication tokens generated in order for user to logout. As long as token exists, it means user is logged in. By tracking tokens generated for a user, users will be able to login from multiple devices and logout from one while staying logged in to the other. If it gets i wrong hands, no way for user to logout and invalidate a token. 
    user.tokens = user.tokens.concat({ token });       
    await user.save();
    return token; 
}

// Generate password reset token using crypto package and calculate an expiry time (1 hour)
UserSchema.methods.generatePasswordResetToken = function () {
    console.log("generatePasswordReset is called!");
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000;
}

// Generate a verification token and return an instance of the Token model
UserSchema.methods.generateVerificationToken = function () {
    console.log("generateVerificationToken is called");
    const user = this;
    return new Token({
        userId: user._id,
        token: crypto.randomBytes(20).toString('hex')
    });
}

// Find user with input email and then validate whether input password matches hashed password in database  
UserSchema.statics.findByCredentials = async (email, password) => {
    console.log('findByCredentials is called');
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User does not exist');
    }
     // Compare user's input password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Password is incorrect');
    }
    return user;
}

// Delete all of the user's linked institutions, accounts, and cash transaction documents before a user is deleted
UserSchema.pre('deleteOne', { document: true, query: false }, async function () {
    console.log("pre-deleteOne user function is called");
    const user = this;
    const deletedInstitutions = await Institution.deleteMany({ ownerId: user._id });
    console.log("deletedInstitutions", deletedInstitutions);
    if (!deletedInstitutions) {
        throw new Error(`Failed to delete user's linked institutions`);
    }
    const deletedAccounts = await Account.deleteMany({ ownerId: user._id });
    console.log("deletedAccounts", deletedAccounts);
    if (!deletedAccounts) {
        throw new Error(`Failed to delete user's accounts`);
    }
    const deletedTransactions = await Transaction.deleteMany({ ownerId: user._id });
    console.log("deletedTransactions", deletedTransactions);
    if (!deletedTransactions) {
        throw new Error(`Failed to delete user's cash transactions`);
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;