const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: "User"
    },
    institutionId: {
        type: String,
        required: true,
        ref: "Institution"
    },
    plaidAccountId: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    balances: {
        type: Object,
        required: true
    },
    mask: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    officialName: {
        type: String
    },
    accountType: {
        type: String,
        required: true
    },
    accountSubtype: {
        type: String
    },
    itemId: {
        type: String,
        required: true
    },
    plaidInstitutionId: {
        type: String,
    },
    institutionName: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);