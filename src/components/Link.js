import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { usePlaidLink } from "react-plaid-link";
import { addAccount } from '../actions/accounts';
import axios from '../services/index';
import { SET_LINK_TOKEN } from "../actions/types";

const Link = () => {
    const dispatch = useDispatch();

    const linkToken = localStorage.getItem('link_token');
    const accounts = useSelector(state => state.accounts);

    useEffect(() => {
        let componentMounted = true; // Boolean Flag to Control the useEffect
        const createLinkToken = async () => {
            console.log("createLinkToken is called");
            await axios.post("/link/token/create").then(res => {
                if (componentMounted) {
                    console.log("link token", res.data.link_token);
                    dispatch({ type: SET_LINK_TOKEN, payload: res.data.link_token });
                }
            })
        }
        createLinkToken();
        return () => { componentMounted = false }; // When a new effect is to be executed then it will clean the previous effect.
    }, []);

    // Add account
    const onSuccess = useCallback((public_token, metadata) => {
        console.log("handleOnSuccess is called");
        console.log("public_token", public_token);
        console.log("metadata", metadata);
        const plaidData = {
            metadata,
            accounts
        }
        dispatch(addAccount(plaidData)); // Send public_token to server, exchange for access_token and item_id, create account doc in db and add it to store, fetch transactions for all accounts and set them to store
    }, []);

    const config = {
        token: linkToken,
        onSuccess
    };

    const { open, ready, error } = usePlaidLink(config);

    return (
    <>
        <button onClick={() => open()} disabled={!ready || error}>
            Connect a bank account
        </button>
    </>
    )
}

export default Link;
