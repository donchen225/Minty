import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getPlaidTransactions, deleteLinkedInstitution } from "../actions/accounts";
import MaterialTable from "material-table";
import { tableIcons } from '../fixtures/tableIcons';
import transitions from '@material-ui/core/styles/transitions';

const Accounts = () => {
    const dispatch = useDispatch();

    const accountsLoading = useSelector(state => state.accounts.accountsLoading);
    const transactionsLoading = useSelector(state => state.accounts.transactionsLoading);
    const institutions = useSelector(state => state.accounts.institutions);
    const accounts = useSelector(state => state.accounts.accounts);
    const transactions = useSelector(state => state.accounts.transactions);

    const totalCash = useSelector(state => state.accounts.accounts
        .filter(account => account.accountType === "depository")
        .map(account => account.balances.current)
        .reduce((total, currentBalance) => (
            total + currentBalance
        ), 0)
        .toFixed(2));

    const totalCredit = useSelector(state => state.accounts.accounts
        .filter(account => account.accountType === "credit")
        .map(account => account.balances.current)
        .reduce((total, currentBalance) => (
            total + currentBalance
        ), 0)
        .toFixed(2));

    const depositAccountItems = useSelector(state => state.accounts.accounts
        .filter(account => account.accountType === "depository"))
        .map(account => (
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
        ));

    const creditAccountItems = useSelector(state => state.accounts.accounts
        .filter(account => account.accountType === "credit"))
        .map(account => (
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
        ));

    useEffect(() => {
        dispatch(getPlaidTransactions(institutions));
    }, []);

    // This will delete linked institution with given id and all of its accounts from database before fetch all transactions from the new list of institutions from database
    const onDeleteClick = (id) => {
        dispatch(deleteLinkedInstitution({ id, institutions }));
    };

    const transactionsData = [];
    transactions && transactions.forEach((institution) => {
        institution.transactions.forEach((transaction) => {
            transactionsData.push({
                institution: institution.institutionName,
                date: transaction.date,
                category: transaction.category[0], 
                name: transaction.name,
                amount: transaction.amount,
                merchant: transaction.merchant_name || "Unknown"
            });
        });
    });

    // Setting up data table
    const transactionsColumns = [
        { title: "Institution", field: "institution" },
        { title: "Date", field: "date", type: "date", defaultSort: "desc" },
        { title: "Name", field: "name" },
        { title: "Amount", field: "amount" },
        { title: "Category", field: "category" },
        { title: "Merchant", field: "merchant" }
    ];

    console.log("institutions", institutions);
    console.log("accounts", accounts);
    console.log("plaid transactions", transactions);
    console.log("transactionsData", transactionsData);

    return (
        <div className="row">
            <div className="col s12">
            { !accountsLoading &&
                <div>
                    <h3 style={{ display: "inline-block", marginRight: "1rem" }}> Cash: </h3> 
                    <p style={{ display: "inline-block", marginRight: "1rem" }}> {`$${totalCash}`}</p>
                    <ul> {depositAccountItems} </ul>
                    
                    <h3 style={{ display: "inline-block", marginRight: "1rem" }}> Credit Cards: </h3>
                    <p style={{ display: "inline-block", marginRight: "1rem" }}> {`-$${totalCredit}`} </p>
                    <ul> {creditAccountItems} </ul>
                </div> 
            }
            {  transactionsLoading ? (
                <p className="grey-text text-darken-1">Fetching transactions...</p>
            ) : (
                <>
                    <h3> <b>Transactions</b> </h3>
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