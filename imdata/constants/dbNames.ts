import DBName from '../interfaces/DBName';
import TableColumns from '../interfaces/TableColumns';

export const LOAN_TABLES: TableColumns[] = [
    {
        name: 'loan_account',
        columns: [
            'loan_acct_pk',
            'loan_cust_fk',
            'loan_start',
            'loan_end',
            'loan_balance',
            'loan_pmt_due_date',
            'loan_amount',
            'loan_acct_status',
        ],
    },
    {
        name: 'loan_address',
        columns: [
            'loan_addr_pk',
            'loan_cust_fk',
            'loan_street',
            'loan_town',
            'loan_postcode',
            'loan_prov',
            'loan_country',
        ],
    },
    {
        name: 'loan_client',
        columns: ['loan_cust_pk', 'loan_last', 'loan_first', 'loan_birth', 'loan_gen', 'loan_mar_stat'],
    },
    {
        name: 'loan_payment',
        columns: ['loan_tran_pk', 'loan_acct_fk', 'loan_dat_pmt', 'loan_amt_pmt'],
    },
];

export const CARD_TABLES: TableColumns[] = [
    {
        name: 'card_account',
        columns: [],
    },
    {
        name: 'card_customer',
        columns: [],
    },
    {
        name: 'card_transaction',
        columns: [],
    },
    {
        name: 'card_address',
        columns: [],
    },
];

export const MORTGAGE_TABLES: TableColumns[] = [
    {
        name: 'mortgage',
        columns: [
            'mort_acct_pk',
            'mort_cust_fk',
            'mg_open',
            'mg_close',
            'mg_bal',
            'mg_status',
            'mg_date_due',
            'mg_valuation',
        ],
    },
    {
        name: 'mort_address',
        columns: ['mort_addr_pk', 'mort_cust_fk', 'mg_ctry', 'mg_pcode', 'mg_state', 'mg_city', 'mg_str'],
    },
    {
        name: 'mortgagee',
        columns: ['mort_cust_pk', 'mg_first', 'mg_last', 'mg_gender', 'mg_marital', 'mg_birth'],
    },
    {
        name: 'mort_payment',
        columns: ['mort_tran_pk', 'mort_acct_fk', 'mg_date_pmt', 'mg_amt_pmt'],
    },
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
    // {
    //     name: 'Card',
    //     tables: CARD_TABLES,
    // },
];
