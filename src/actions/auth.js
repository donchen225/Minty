import axios from '../services/index';
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
} from './types';

export const loginError = (e) => ({
    type: LOGIN_FAILURE,
    message: e.message
});

/* This async action function will be called when user clicks the login button on client. It will dispatch LOGIN_REQUEST action to the auth reducer. It will then send a post request to /users/login route with the user credentials. 
If the request is successful, it will dispatch LOGIN_SUCCESS action to the auth reducer with the user and JWT token that it received from the server. If the request is unsuccessful, it will dispatch LOGIN_ERROR action with the error message that needs to be rendered on client. */     
export const loginUser = (creds) => async (dispatch) => {
    console.log('loginUser is called');
    try {
        dispatch({ type: LOGIN_REQUEST, creds });
        let res = await axios.post('/users/login', creds);
        if (res) {
            let { user, token } = res.data;
            dispatch({
                type: LOGIN_SUCCESS,
                user: { 
                    id_token: user._id, 
                    auth_token: token 
                }
            });
        }
    } catch (e) { // This is how to read and handle errors w/ Axios
        if (e.response) { // The request was made and the server responded w/ status code that falls out of the range of 2xx
            console.log(e.response.data.message);
            dispatch(loginError(e.response.data));
        }
    }
}

export const logoutError = (e) => ({
    type: LOGOUT_FAILURE,
    message: e.message
});

// This async action function will be called when user clicks on logout button on client. It will dispatch LOGOUT_REQUEST action before sending a POST request to /users/logout route
// If the request is successful, dispatch LOGOUT_SUCCESS action. If the request is unsuccessful, dispatch LOGOUT_FAILURE with the error message that needs to be rendered on client 
export const logoutUser = () => async (dispatch) => {
    console.log('logoutUser is called');
    try {
        dispatch({ type: LOGOUT_REQUEST });
        await axios.post('/users/logout');
        dispatch({ type: LOGOUT_SUCCESS });
    } catch (e) {
        if (e.response) {
            console.log(e.response.data.message);
            dispatch(logoutError(e.response.data));
        }
    }
}

export const logoutAll = () => async dispatch => {
    console.log('logoutAll is called');
    try {
        dispatch ({ type: LOGOUT_REQUEST });
        await axios.post('/users/logoutAll');
        dispatch({ type: LOGOUT_SUCCESS });
    } catch (e) {
        if (e.response) {
            console.log(e.response.data.message);
            dispatch(logoutError(e.response.data));
        }
    }
}

export const signupError = (e) => ({
    type: SIGNUP_FAILURE,
    message: e.message
});

// This async action function will be called when user clicks on signup button in client. It will dispatch SIGNUP_REQUEST action with the user credentials submitted from the client and send a POST request to /users route
// If the request is successful, dispatch SIGNUP_SUCCESS with the message received from the server. If the rqeuest is unsuccessful, it will dispatch SIGNUP_FAILURE action with the error message that needs to be rendered on client. 
export const registerUser = (creds) => async (dispatch) => { 
    console.log('registerUser is called');
    try {
        dispatch({ type: SIGNUP_REQUEST, creds }); // creds is an object with firstName, lastName, email, and password
        const res = await axios.post('/users', creds);
        const { message } = res.data;
        if (res) {
            dispatch({
                type: SIGNUP_SUCCESS,
                message: message
            });
        }
    }
    catch(e) { 
        if (e.response) {
            console.log(e.response.data.message);
            dispatch(signupError(e.response.data));
        }
    }
};

// This async action function will be called when user clicks deleteUser button in client. It will send a DELETE request to /users/me route.
// If the request is successful, it will dispatch a DELETE_USER. If unsuccessful, it will dispatch ERROR with error message sent back from server 
export async function deleteUser (dispatch) {
    console.log('deleteUser is called');
    try {
        const res = await axios.delete('/users/me');
        if (res) dispatch({ type: DELETE_USER });
    }
    catch (e) {
        if (e.response) {
            console.log(e.response.data.message);
        }
    }
};

// This async action function will be called when user attempts to authenticate using google from client. 
export const googleSuccess = async googleData => {
    console.log("googleSuccess is called");
    console.log("googleData: ", googleData);
    const googleTokenId = googleData?.tokenId;
    try {
        const res = await axios.post('/auth/google', { googleTokenId });
        dispatch({ 
            type: LOGIN_SUCCESS, 
            user: {
                auth_token: res.data.token,
                data: res.data.user
            }
        });
    } catch (e) {
        console.log(e);
    }
}
