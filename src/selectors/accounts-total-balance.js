export default (accounts, { accountType }) => {
    return accounts
        .filter(account => account.accountType.toLowerCase().includes(accountType.toLowerCase()))
        .map(account => account.balances.current)
        .reduce((total, currBalance) => (
            total + currBalance
        ), 0)
        .toFixed(2)
};