import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getPlaidTransactions, unlinkInstitution } from "../actions/accounts";
import MaterialTable from "material-table";
import { tableIcons } from '../fixtures/tableIcons';

const Accounts = ({ accounts, institutions }) => {
    const dispatch = useDispatch();

    const transactionsLoading = useSelector(state => state.accounts.transactionsLoading);
    const plaidTransactions = useSelector(state => state.accounts.transactions);

    useEffect(() => {
        dispatch(getPlaidTransactions(accounts));
    }, []);

    // This will delete institution with given id from database, delete all accounts from institution from db, remove institution from the store, and fetch all transactions from the new list of institutions from database
    // const onDeleteClick = (id) => {
    //     dispatch(unlinkInstitution({ id, institutions }));
    // };

    console.log("institutions", institutions);
    console.log("accounts", accounts);
    console.log("transactions", plaidTransactions);

    const totalCash = accounts
        .filter(account => account.accountType === "depository")
        .map(account => account.balances.current)
        .reduce((total, currentBalance) => (
            total + currentBalance
        ), 0)
        .toFixed(2);
    
    const totalCredit = accounts
        .filter(account => account.accountType === "credit")
        .map(account => account.balances.current)
        .reduce((total, currentBalance) => (
            total + currentBalance
        ), 0)
        .toFixed(2);

    const depositAccounts = accounts.map( account => {
        if (account.accountType === "depository")
        return (
            <li key={account._id} style={{ marginTop: "1rem" }}>
                <button
                    style={{marginRight: "1rem"}}
                    onClick={() => onDeleteClick(account._id)}
                    className="btn btn-small btn-floating waves-effect waves-light hoverable red accent-3"
                >
                    <i className="material-icons">delete</i>
                </button>
                <b> {account.officialName ? account.officialName : account.name} </b>
                <span> {account.institutionName} </span>
                <span style={{marginRight: "5rem"}}> {`$${account.balances.current}`} </span>
            </li>
        );
    });

    const creditAccounts = accounts.map( account => {
        if (account.accountType === "credit")
        return (
            <li key={account._id} style={{ marginTop: "1rem" }}>
                <button
                    style={{marginRight: "1rem"}}
                    onClick={() => onDeleteClick(account._id)}
                    className="btn btn-small btn-floating waves-effect waves-light hoverable red accent-3"
                >
                    <i className="material-icons">delete</i>
                </button>
                <b> {account.officialName ? account.officialName : account.name} </b>
                <span> {account.institutionName} </span>
                <span style={{marginRight: "5rem"}}> {`-$${account.balances.current}`} </span>
            </li>
        );
    });

    // Setting up data table
    const transactionsColumns = [
        { title: "Account", field: "account" },
        { title: "Date", field: "date", type: "date", defaultSort: "desc" },
        { title: "Name", field: "name" },
        { title: "Amount", field: "amount" },
        { title: "Category", field: "category" }
    ];

    let transactionsData = [];
    plaidTransactions.forEach((account) => {
        account.transactions.forEach((transaction) => {
            transactionsData.push({
                account: account.accountName,
                date: transaction.date,
                category: transaction.category[0], 
                name: transaction.name,
                amount: transaction.amount,
                merchant_name: transaction.merchant_name
            });
        });
    });
    console.log("transactionsData", transactionsData);

    return (
        <div className="row">
            <div className="col s12">
            <h3> All Linked Accounts </h3>
            <div>
                <h3 style={{ display: "inline-block", marginRight: "1rem" }}> Cash: </h3> 
                <p style={{ display: "inline-block", marginRight: "1rem" }}> {`$${totalCash}`}</p>
                <ul> {depositAccounts} </ul>
            </div>
            <div>
                <h3 style={{ display: "inline-block", marginRight: "1rem" }}> Credit Cards: </h3>
                <p style={{ display: "inline-block", marginRight: "1rem" }}> {`-$${totalCredit}`} </p>
                <ul> {creditAccounts} </ul>
            </div>
            <h3>
                <b>Transactions</b>
            </h3>
            {transactionsLoading ? (
                <p className="grey-text text-darken-1">Fetching transactions...</p>
            ) : (
                <>
                    <p className="grey-text text-darken-1">
                        You have <b>{transactionsData.length}</b> transactions from your
                        <b> {accounts.length}</b> linked
                        {accounts.length > 1 ? (
                        <span> accounts </span>
                        ) : (
                        <span> account </span>
                        )}
                        from the past 30 days
                    </p>
                    <MaterialTable
                        title="Search Transactions"
                        columns={transactionsColumns}
                        data={transactionsData}
                        options={{
                            headerStyle: {
                              backgroundColor: '#01579b',
                              color: '#FFF'
                            }
                        }}
                        icons={tableIcons}
                    />
                </>
            )}
            </div>
        </div>
    )
}

export default Accounts;

