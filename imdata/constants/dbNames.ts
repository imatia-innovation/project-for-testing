import logger from '../functions/utils/logger';
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
        columns: [
            'card_acct_pk',
            'card_cust_fk',
            'cc_open',
            'cc_close',
            'cc_curr_bal',
            'cc_due_date',
            'cc_status',
            'cc_min_pmt',
            'cc_credit_limit',
        ],
    },
    {
        name: 'card_customer',
        columns: ['card_cust_pk', 'cc_first', 'cc_last', 'cc_dob', 'cc_gender', 'cc_marital'],
    },
    {
        name: 'card_transaction',
        columns: ['card_tran_pk', 'card_acct_fk', 'cc_dat_purchase', 'cc_amt_purchase', 'cc_tran_country'],
    },
    {
        name: 'card_address',
        columns: ['card_addr_pk', 'card_cust_fk', 'cc_road', 'cc_city', 'cc_post', 'cc_province', 'cc_country'],
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
        name: 'Card',
        tables: CARD_TABLES,
    },
    {
        name: 'Loan',
        tables: LOAN_TABLES,
    },
    {
        name: 'Mortgage',
        tables: MORTGAGE_TABLES,
    },
];

export function getDbNames(): string[] {
    return DB_NAMES.map((dbName) => dbName.name);
}

export function getTableNamesByDB(dbName: DBName): string[] {
    return dbName.tables.map((t) => t.name);
}

export function getAllTableNames(): string[] {
    let tableNames: string[] = [];
    DB_NAMES.forEach((dbName) => {
        dbName.tables.forEach((tableName) => {
            tableNames.push(tableName.name);
        });
    });
    return tableNames;
}

export function getAllColumnsNames(): string[] {
    let columnNames: string[] = [];
    DB_NAMES.forEach((dbName) => {
        dbName.tables.forEach((tableName) => {
            tableName.columns.forEach((column) => {
                columnNames.push(column);
            });
        });
    });
    return columnNames;
}

export function getColumnNamesByTable(dbName: DBName, tableName: string): string[] {
    logger.info(' Start dbNames.ts getColumnNamesByTable', { dbName, tableName });
    const filteredTableCol = dbName.tables
        .map((table) => table)
        .filter((tableCol) => tableCol.name === tableName)
        .pop();
    const columns = filteredTableCol?.columns || [];
    logger.info('  dbNames.ts getColumnNamesByTable ', {
        filteredTableCol,
        columns,
    });
    logger.info(' Finish dbNames.ts getColumnNamesByTable');
    return columns;
}
