import {
    SET_LINK_TOKEN,
    ADD_LINKED_INSTITUTION,
    SET_LINKED_INSTITUTIONS,
    DELETE_LINKED_INSTITUTION,
    ADD_ACCOUNTS,
    SET_ALL_ACCOUNTS,
    ACCOUNTS_LOADING,
    SET_PLAID_TRANSACTIONS,
    PLAID_TRANSACTIONS_LOADING
} from "../actions/types";

const initialState = {
    institutions: [],
    accounts: [],
    transactions: [],
    accountsLoading: false,
    transactionsLoading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_LINK_TOKEN:
            localStorage.setItem("link_token", action.payload);
            return {
                ...state,
                linkToken: action.payload
            };
        case ADD_LINKED_INSTITUTION:
            return {
                ...state,
                institutions: [action.payload, ...state.institutions]
            };
        case SET_LINKED_INSTITUTIONS:
            return {
                ...state,
                institutions: action.payload
            }
        case DELETE_LINKED_INSTITUTION:
            return {
                institutions: state.institutions.filter(
                    institution => institution._id !== action.payload
                )
            };
        case ADD_ACCOUNTS:
            return {
                ...state,
                accountsLoading: false,
                accounts: [action.payload, ...state.accounts]
            }
        case ACCOUNTS_LOADING:
            return {
                ...state,
                accountsLoading: true
            };
        case SET_ALL_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload,
                accountsLoading: false
            };
        case PLAID_TRANSACTIONS_LOADING:
            return {
                ...state,
                transactionsLoading: true
            };
        case SET_PLAID_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
                transactionsLoading: false
            };
        default:
            return state;
        }
}