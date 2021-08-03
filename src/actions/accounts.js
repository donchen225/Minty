import axios from '../services/index';
import {
    ADD_ACCOUNT,
    DELETE_ACCOUNT,
    GET_ACCOUNTS,
    ACCOUNTS_LOADING,
    GET_TRANSACTIONS,
    TRANSACTIONS_LOADING
} from "./types";

// Add account
export const addAccount = plaidData => async dispatch => {
    console.log("addAccount is called");
    try {
        const accounts = plaidData.accounts;
        const res = await axios.post("/item/public_token/exchange", plaidData.metadata);
        const data = await dispatch({ type: ADD_ACCOUNT, payload: res.data });
        if (accounts) {
            dispatch(getTransactions(accounts.concat(data.payload)))
        }
    } catch (e) {
        console.log(e);
    }
};

// Delete account
export const deleteAccount = plaidData => async dispatch => {
    console.log("deleteAccount is called");
    try {
        if (window.confirm("Are you sure you want to remove this account?"));
        const id = plaidData.id;
        const newAccounts = plaidData.accounts.filter( account => account._id !== id );
        await axios.delete(`/accounts/${id}`);
        dispatch({ type: DELETE_ACCOUNT, payload: id });
        if (newAccounts) {
            dispatch(getTransactions(newAccounts))
        }
    } catch (e) {
        console.log(e);
    }
}

// Get all linked accounts of currently authenticated user
export const getAccounts = () => async dispatch => {
    console.log("getAccounts is called");
    try {
        dispatch({ type: ACCOUNTS_LOADING });
        const res = await axios.get("/accounts");
        console.log(res.data);
        dispatch({ type: GET_ACCOUNTS, payload: res.data });
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_ACCOUNTS, payload: null }); 
    }
}

// Get transactions
export const getTransactions = plaidData => async dispatch => {
    console.log("getTransactions is called");
    try {
        dispatch({ type: TRANSACTIONS_LOADING });
        const res = await axios.post("/transactions/get", plaidData);
        dispatch({ type: GET_TRANSACTIONS, payload: res.data });
    } catch (e) {
        dispatch({ type: GET_TRANSACTIONS, payload: null });
    }
}
