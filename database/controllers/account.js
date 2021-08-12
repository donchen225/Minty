const Institution = require("../models/institution");
const Account = require("../models/account");

// @route   GET /institutions
// @desc    Get all of the currently authenticated user's linked institutions
// @access  Private
exports.getLinkedInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find({});
        if (institutions) {
            res.send(institutions);
        } else {
            throw Error("User is not linked to any financial institutions");
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

// @route   DELETE /institution/:id
// @desc    Unlink a institution
// @access  Private
exports.deleteLinkedInstitution = async (req, res) => {
    try {
        const institution = await Institution.findById(req.params.id);
        await institution.deleteOne();
        res.json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

// @route   GET /accounts
// @desc    Get all of the currently authenticated user's linked accounts
// @access  Private
exports.getAllAccounts= async (req, res) => {
    try {
        const accounts = await Account.find({ ownerId: req.user.id });
        if (accounts) {
            res.send(accounts);
        } else {
            throw new Error("User has no linked accounts");
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

// @route   DELETE /accounts/:id
// @desc    Delete linked account with given id
// @access  Private
exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        await account.remove();
        res.json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}
