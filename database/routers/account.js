const express = require("express");
const router = new express.Router();

const Account = require('../controllers/account');
const auth = require('../middlewares/auth');

// @route   GET /institutions
// @desc    Get all financial institutions that the currently authenticated user is linked to
// @access  Private
router.get("/institutions", auth, Account.getLinkedInstitutions);

// @route   DELETE /institution
// @desc    Unlink a institution
// @access  Private
router.delete("/institution/:id", auth, Account.deleteLinkedInstitution);


// @route   DELETE /accounts/:id
// @desc    Delete linked account with given id
// @access  Private
router.delete("/accounts/:id", auth, Account.deleteAccount);

// @route   GET /accounts
// @desc    Get all linked accounts that the currently authenticated user is linked to
// @access  Private
router.get("/accounts", auth, Account.getAllAccounts);


module.exports = router;