import DBName from '../interfaces/DBName';

export const LOAN_TABLES: string[] = [' loan_account ', ' loan_address ', ' loan_client ', ' loan_payment '];

export const CARD_TABLES: string[] = [' card_account ', ' card_customer ', ' card_transaction ', ' card_address '];

export const MORTGAGE_TABLES: string[] = [
    ' mortgage ',
    ' mort_address ',
    ' mortgagee ', // customer
    ' mort_payment ',
];

export const DB_NAMES: DBName[] = [
    {
        name: 'Loan',
        tables: LOAN_TABLES,
    },
    {
        name: 'Mortgage',
        tables: MORTGAGE_TABLES,
    },
    {
        name: 'Card',
        tables: CARD_TABLES,
    },
];
