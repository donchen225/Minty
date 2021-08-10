export default (accounts, { institution, type, subtype, text }) => {
    return accounts.filter((account) => {
        const institutionMatch = account.institutionName.toLowerCase().includes(institution.toLowerCase());
        const accountTypeMatch = account.accountType.toLowerCase().includes(type.toLowerCase());
        const accountSubtypeMatch = account.accountSubtype.toLowerCase().includes(subtype.toLowerCase());
        const textMatch = account.officialName.toLowerCase().includes(text.toLowerCase()) || account.name.toLowerCase().includes(text.toLowerCase());
        
        return institutionMatch && accountTypeMatch && accountSubtypeMatch && textMatch;
    }).sort();
};