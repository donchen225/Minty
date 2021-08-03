const client = require('../../configs/plaidClient'); // initialize plaid client
const Account = require("../models/account");
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
// @desc    Trades public token for access token and stores credentials in database
// @access  Private
exports.exchangeToken = async (req, res) => {
    try {
        const PUBLIC_TOKEN = req.body.public_token; // Parse public token and other data from request 
        const userId = req.user._id;
        const institution = req.body.institution;
        const { name, institution_id } = institution;
        console.log("public token", PUBLIC_TOKEN)
        console.log("userId", userId);
        console.log("institution", institution);
        
        if (PUBLIC_TOKEN) { // This will exchange public token for access token and store access token so we can get transactions and other account specific data
            const exchangeResponse = await client.exchangePublicToken(PUBLIC_TOKEN);
            const ACCESS_TOKEN = exchangeResponse.access_token;
            console.log("access token", ACCESS_TOKEN);
            const ITEM_ID = exchangeResponse.item_id;
            console.log("item id", ITEM_ID);

            // Check if account for specific institution already exists for currently auth user
            const account = await Account.findOne({
                ownerId: userId,
                institutionId: institution_id
            });

            if (account) {
                throw new Error("Account already exists!")
            } else {
                // Create new account document to save in database
                const newAccount = new Account({
                    ownerId: userId,
                    accessToken: ACCESS_TOKEN,
                    itemId: ITEM_ID,
                    institutionId: institution_id,
                    institutionName: name
                });
                await newAccount.save();
                // Send account data w/ access token to client 
                res.json(newAccount);
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

// @route   POST /transactions/get
// @desc    Fetch transactions from past 30 days from all linked accounts from plaid API
// @access  Private
exports.retrieveTransactions = (req, res) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");
    const transactions = [];
    const accounts = req.body;
    if (accounts) {
        accounts.forEach((account) => {
            const ACCESS_TOKEN = account.accessToken;
            const institutionName = account.institutionName;
            client.getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
            .then((response) => {
                transactions.push({
                    accountName: institutionName,
                    transactions: response.transactions
                });
                // Don't send back response till all transactions have been added
                if (transactions.length === accounts.length) {
                    res.json(transactions);
                }
            })
            .catch((e) => console.log(e));
        })
    }   
}

// exports.retrieveInstitutions = async (req, res) => {
//     try {
//         const countryCodes = req.body.countryCodes;
//         await client.getInstitutions(count, offset, countryCodes, (err, result) => {
//             const institutions = result.institutions;
//             res.json(institutions);
//         });
//     } catch(e) {
//         console.log(e);
//         res.status(400).send(e);
//     }
// }