const express = require("express");
const router = new express.Router();

const Plaid = require('../controllers/plaid');
const auth = require('../middlewares/auth');

// @route   POST /link/token/create
// @desc    Create link token and send back to client 
// @access  Private
router.post("/link/token/create", auth, Plaid.createLinkToken);

// @route   POST /item/public_token/exchange
// @desc    Trade public token for access token, add institution to db to store access token, use the access token to fetch the institution's accounts, and add the accounts to db
// @access  Private
router.post("/item/public_token/exchange", auth, Plaid.linkInstitutionAndAccounts);

// @route   POST /transactions/get
// @desc    Fetch transactions from past 30 days from all linked bank accounts using Plaid API
// @access  Private
router.post("/transactions/get", Plaid.retrieveTransactions);

// @route   GET /acounts/balance/get
// @desc    Get real-time balance of all linked bank accounts using Plaid API
// @access  Private
router.get("/accounts/balance/get", auth, Plaid.retrieveBalance); 

module.exports = router;