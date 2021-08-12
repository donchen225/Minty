const mongoose = require("mongoose");
const Account = require('./account');

const InstitutionSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: "User"
    },
    plaidInstitutionId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    accounts: {
        type: Array,
        required: true
    },
    itemId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// This will define a populated virtual, telling Mongoose to populate docs from 'Account' model whose foreignField (ownerId) matches the institution document's localField (_id) 
InstitutionSchema.virtual('account', {
    ref: 'Account',
    localField: '_id',
    foreignField: 'institutionId'
})

// Delete all of a linked institution's account documents before linked institution is deleted
InstitutionSchema.pre('deleteOne', { document: true, query: false }, async function () {
    console.log("pre-deleteOne transaction function is called");
    const institution = this;
    const deletedAccounts = await Account.deleteMany({ institutionId: institution._id });
    console.log("deletedAccounts", deletedAccounts);
    if (!deletedAccounts) {
        throw new Error(`Failed to delete user's accounts`);
    }
})

module.exports = mongoose.model('Institution', InstitutionSchema);