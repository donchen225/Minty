import axios from '../services/index';
import {
    ADD_LINKED_INSTITUTION,
    SET_LINKED_INSTITUTIONS,
    DELETE_LINKED_INSTITUTION,
    ADD_ACCOUNTS,
    SET_ALL_ACCOUNTS,
    ACCOUNTS_LOADING,
    SET_PLAID_TRANSACTIONS,
    PLAID_TRANSACTIONS_LOADING
} from "./types";

// Link institution
export const linkInstitution = ({ metadata, accounts }) => async dispatch => {
    console.log("linkInstitution is called");
    try {
        const res = await axios.post("/item/public_token/exchange", metadata);
        console.log("initial accounts", accounts);
        console.log("new accounts being added", res.data.accounts);
        await dispatch({ type: ADD_LINKED_INSTITUTION, payload: res.data });
        const newAccounts = await dispatch({ type: ADD_ACCOUNTS, payload: res.data.accounts});
        dispatch(getTransactions(accounts.concat(newAccounts.payload)));
    } catch (e) {
        console.log(e);
    }
};

// Get all linked institutions of currently authenticated user
export const getLinkedInstitutions = () => async dispatch => {
    console.log("getLinkedInstitutions is called");
    try {
        const res = await axios.get("/institutions");
        dispatch({ type: SET_LINKED_INSTITUTIONS, payload: res.data });
    } catch (e) {
        console.log(e);
    }
}

// Unlink institution
export const unlinkInstitution = ({ id, institutions }) => async dispatch => {
    console.log("unlinkInstitution is called");
    try {
        if (window.confirm("Are you sure you want to unlink this institution?"));
        const newInstitutions = institutions.filter( institution => institution._id !== id );
        await axios.delete(`/institutions/${id}`);
        // Must delete all accounts of unlinked institution
        dispatch({ type: DELETE_LINKED_INSTITUTION, payload: id });
        dispatch(getTransactions(newInstitutions));
    } catch (e) {
        console.log(e);
    }
}

// Get all accounts of currently authenticated user's linked institutions
export const getAccounts = () => async dispatch => {
    console.log("getAccounts is called");
    try {
        dispatch({ type: ACCOUNTS_LOADING });
        const res = await axios.get("/accounts");
        dispatch({ type: SET_ALL_ACCOUNTS, payload: res.data });
    } catch (e) {
        console.log(e);
        dispatch({ type: SET_ALL_ACCOUNTS, payload: null }); 
    }
}

// Get all transactions of all linked acounts from Plaid API
export const getPlaidTransactions = (accounts) => async dispatch => {
    console.log("getTransactions is called");
    try {
        dispatch({ type: PLAID_TRANSACTIONS_LOADING });
        const res = await axios.post("/transactions/get", accounts);
        dispatch({ type: SET_PLAID_TRANSACTIONS, payload: res.data });
    } catch (e) {
        dispatch({ type: SET_PLAID_TRANSACTIONS, payload: null });
    }
}
