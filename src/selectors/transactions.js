import moment from 'moment';

export default (transactions, { institution, account, category, text, sortBy, startDate, endDate }) => {
    return transactions
    .map(account => account.transactions.map(transaction => (
        {
            account: account.accountName,
            date: transaction.date,
            category: transaction.category[0], 
            name: transaction.name,
            amount: transaction.amount,
            merchant_name: transaction.merchant_name
        }
    )))
    .filter((transaction) => {
        const createdAtMoment = moment(transaction.date);
        const institutionMatch = transaction.institution.toLowerCase().includes(institution.toLowerCase());
        const accountMatch = transaction.account.toLowerCase().includes(account.toLowerCase());
        const categoryMatch = transaction.category.toLowerCase().includes(category.toLowerCase());
        const textMatch = transaction.name.toLowerCase().includes(text.toLowerCase());
        const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day'): true;
        const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
        
        return institutionMatch && accountMatch && categoryMatch && textMatch && startDateMatch && endDateMatch;
    }).sort((a,b) => {
        if (sortBy === 'date') {
            return a.createdAt < b.createdAt ? 1 : -1;
        }
        if (sortBy === 'amount') {
            return a.amount < b.amount ? 1 : -1;
        }
    })
};