import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Accounts from "./Accounts";
import Link from "./Link";
import { getLinkedInstitutions, getAccounts } from '../actions/accounts';

import { useStyles } from '../styles/useStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

const DashboardPage = () => {
    const dispatch = useDispatch();

    const classes = useStyles();
    
    const accounts = useSelector(state => state.accounts.accounts);
    const accountsLoading = useSelector(state => state.accounts.accountsLoading);

    // Fetch linked institutions and accounts from database
    useEffect(() => { 
        dispatch(getLinkedInstitutions());
        dispatch(getAccounts());
    }, []);

    let dashboardContent; 

    if (accounts === null || accountsLoading) {
        dashboardContent = <p> Loading... </p>
    } else if (accounts.length > 0) { 
        // User has accounts linked
        dashboardContent = <Accounts/>
    } else { 
        // User has no accounts linked
        dashboardContent = 
        <div>
            <p className="grey-text text-darken-1">
                Add your first bank account below
            </p>
            <Link/>
        </div>
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <div>{dashboardContent}</div>
                </Container>
            </main>
        </div>
    )
}

export default DashboardPage;
