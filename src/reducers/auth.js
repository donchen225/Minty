import {
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    DELETE_USER
} from '../actions/types';

const authReducersDefaultState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'), // This is what will determine whether user is autheticated or not 
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false
};

export default (state = authReducersDefaultState, action) => {
    switch (action.type) {
        case SIGNUP_REQUEST:
            return {
                ...state,
                isSigningUp: true,
                isAuthenticated: false,

            }
        case SIGNUP_SUCCESS: 
            return {
                ...state,
                isSigningUp: false,
                isAuthenticated: false,
                message: action.message,
                errorMessage: ''
            }
        case SIGNUP_FAILURE:
            return {
                ...state,
                isSigningUp: false,
                isAuthenticated: false,
                errorMessage: action.message
            }
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                isAuthenticated: false
            }
        case LOGIN_SUCCESS: 
            localStorage.setItem('user', JSON.stringify(action.user));
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user
            }
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: false,
                errorMessage: action.message
            }
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true,
                isAuthenticated: true
            }
        case LOGOUT_SUCCESS:
            localStorage.removeItem('user'); 
            return {
                ...state,
                isLoggingOut: false,
                isAuthenticated: false,
                user: null
            }
        case LOGOUT_FAILURE:
            return {
                ...state,
                isLoggingOut: false,
                isAuthenticated: true,
                errorMessage: action.message
            }
        case DELETE_USER:
            localStorage.removeItem('user'); 
            return {
                ...state,
                isAuthenticated: false,
                user: null
            }
        default:
            return state;
    }
};