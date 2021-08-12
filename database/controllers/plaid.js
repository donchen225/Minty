const client = require('../../configs/plaidClient'); // initialize plaid client
const Account = require("../models/account");
const Institution = require("../models/institution");
const moment = require('moment');
const keys = require('../../configs/keys');

// @route   POST /link/token/create
// @desc    Create link token and send back to client 
// @access  Private
exports.createLinkToken = async (req, res) => {
    try {
        // Access currently authenticated user id from req body
        const userId = req.user._id;
        // Create a link_token for the given user
        const linkTokenResponse = await client.createLinkToken({
            user: {
              client_user_id: userId,
            },
            client_name: 'Expensify',
            products: ['transactions'],
            country_codes: ['US'],
            language: 'en',
            redirect_uri: keys.PLAID_REDIRECT_URI // needed for oauth implementation
        });
        // Send the data to the client
        res.json({ link_token: linkTokenResponse.link_token });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

// @route   POST /item/public_token/exchange
// @desc    Trade public token for access token, add institution to database to store access token, use the access token to fetch the institution's accounts, and add the accounts to database
// @access  Private
exports.linkInstitutionAndAccounts = async (req, res) => {
    try {
        // Parse public token and other data from request
        const PUBLIC_TOKEN = req.body.public_token; 
        const userId = req.user._id;
        const institution = req.body.institution;
        const { institution_id } = institution;
        
        if (PUBLIC_TOKEN) { 
            // This will exchange public token for access token and store access token so we can get transactions and other account specific data
            const exchangeResponse = await client.exchangePublicToken(PUBLIC_TOKEN);
            console.log("exchangeResponse", exchangeResponse);
            const ACCESS_TOKEN = exchangeResponse.access_token;
            const ITEM_ID = exchangeResponse.item_id;

            // if institution doc does not yet exist, create new institution doc and save to db
            const institutionDoc = await Institution.findOneAndUpdate({ 
                ownerId: userId,
                plaidInstitutionId: institution_id,
                name: institution.name,
            }, {
                accessToken: ACCESS_TOKEN,
                itemId: ITEM_ID,
            }, {
                new: true,
                upsert: true,
                useFindAndModify: false
            });

            // Fetch accounts data for institution from Plaid API
            const accountsResponse = await client.getAccounts(ACCESS_TOKEN);
            const accounts = accountsResponse.accounts;
            const accountDocuments = [];
            console.log("accounts data", accounts);

            // Check if institution has at least one account
            if (accounts.length > 0) {
                // iterate over all of the institution's accounts 
                for await (let account of accounts) {
                    const { account_id, balances, mask, name, official_name, type, subtype } = account;

                    // if account doc already exist in database, update its data. else, create a new account doc and save to db.  
                    const accountDoc = await Account.findOneAndUpdate({
                        ownerId: userId,
                        name,
                        officialName: official_name,
                        mask
                    }, {
                        accessToken: ACCESS_TOKEN,
                        institutionId: institutionDoc._id,
                        plaidAccountId: account_id,
                        plaidInstitutionId: institution_id,
                        itemId: ITEM_ID,
                        balances,
                        accountType: type,
                        accountSubtype: subtype,
                        institutionName: institution.name
                    }, {
                        new: true,
                        upsert: true,
                        useFindAndModify: false
                    });
                    accountDocuments.push(accountDoc);
                }
            }

            // update the institution doc's accounts field with all the newly created account docs 
            const institutionDocument = await Institution.findOneAndUpdate({ 
                ownerId: userId,
                plaidInstitutionId: institution_id,
                name: institution.name
            }, { 
                accounts: accountDocuments
            }, {
                new: true,
                useFindAndModify: false
            });
            // send institution doc with all of the accounts back to client 
            res.send(institutionDocument)
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

// @route   GET /acounts/balance/get
// @desc    Get real-time balance of all linked bank accounts through Plaid API
// @access  Private
exports.retrieveBalance = async (req, res) => {
    try {
        // access list of linked institutions 
        const { institutions } = req.body;
        // for each institution, call getBalance on its accessToken to retrieve all of its' accounts and their respective balances
        for await (let institution of institutions) {   
            const ACCESS_TOKEN = institution.accessToken;
            const response = await client.getBalance(ACCESS_TOKEN);
            console.log("response", response);
            const accounts = response.accounts;
            // Update account document with the new balance
            await Account.findOneAndUpdate(
                { accountId: accounts.account_id }, 
                { balance: accounts.balance }, 
                { new: true, useFindAndModify: false }
            );
        }
        const accountsData = await Account.find({});
        res.send(accountsData);
    } catch (e) {
        res.status(500).send(e);
    }
}

// @route   POST /transactions/get
// @desc    Fetch transactions from past 30 days from all linked accounts through Plaid API
// @access  Private
exports.retrieveTransactions = async (req, res) => {
    try {
        const now = moment();
        const today = now.format("YYYY-MM-DD");
        const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");
        const transactions = [];
        const institutions = req.body;
        if (institutions) {
            for await (let institution of institutions) {
                const ACCESS_TOKEN = institution.accessToken;
                const institutionName = institution.name;
                const response = await client.getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today);
                transactions.push({
                    institutionName,
                    transactions: response.transactions
                });
            }
            res.send(transactions);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

