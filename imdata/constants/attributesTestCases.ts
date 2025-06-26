import { AttributeTestCase } from '../interfaces/AttributeTestCase';

// Account

export const accountPK: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_pk',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_acct_pk',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mort_acct_pk',
        },
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'card_acct_pk',
        },
    ],
};

export const accountCustomerFK: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_customer_fk',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_cust_fk',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mort_cust_fk',
        },
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'card_cust_fk',
        },
    ],
};

export const accountStartDate: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_start_date',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_start',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mg_open',
        },
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'cc_open',
        },
    ],
};

export const accountEndDate: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_end_date',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_end',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mg_close',
        },
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'cc_close',
        },
    ],
};

export const accountBalance: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_balance',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_balance',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mg_bal',
        },
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'cc_curr_bal',
        },
    ],
};

export const accountDueDate: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_due_date',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_pmt_due_date',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mg_date_due',
        },
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'cc_due_date',
        },
    ],
};

export const accountStatus: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_status',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_acct_status',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mg_status',
        },
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'cc_status',
        },
    ],
};

export const accountMinPmt: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_min_pmt',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'cc_min_pmt',
        },
    ],
};

export const accountCreditLimit: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_credit_limit',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Card',
            tableName: 'card_account',
            columnName: 'cc_credit_limit',
        },
    ],
};

export const accountAmount: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'account_amount',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_account',
            columnName: 'loan_amount',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgage',
            columnName: 'mg_valuation',
        },
    ],
};

// Address

export const addressPK: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'address_pk',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_address',
            columnName: 'loan_addr_pk',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_address',
            columnName: 'mort_addr_pk',
        },
        {
            dbName: 'Card',
            tableName: 'card_address',
            columnName: 'card_addr_pk',
        },
    ],
};

export const addressCustomerFK: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'address_customer_fk',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_address',
            columnName: 'loan_cust_fk',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_address',
            columnName: 'mort_cust_fk',
        },
        {
            dbName: 'Card',
            tableName: 'card_address',
            columnName: 'card_cust_fk',
        },
    ],
};

export const addressStreet: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'address_street',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_address',
            columnName: 'loan_street',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_address',
            columnName: 'mg_str',
        },
        {
            dbName: 'Card',
            tableName: 'card_address',
            columnName: 'cc_road',
        },
    ],
};

export const addressCity: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'address_city',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_address',
            columnName: 'loan_town',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_address',
            columnName: 'mg_city',
        },
        {
            dbName: 'Card',
            tableName: 'card_address',
            columnName: 'cc_city',
        },
    ],
};

export const addressZipCode: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'address_zip_code',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_address',
            columnName: 'loan_postcode',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_address',
            columnName: 'mg_pcode',
        },
        {
            dbName: 'Card',
            tableName: 'card_address',
            columnName: 'cc_post',
        },
    ],
};

export const addressState: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'address_state',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_address',
            columnName: 'loan_prov',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_address',
            columnName: 'mg_state',
        },
        {
            dbName: 'Card',
            tableName: 'card_address',
            columnName: 'cc_province',
        },
    ],
};

export const addressCountry: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'address_country',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_address',
            columnName: 'loan_country',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_address',
            columnName: 'mg_ctry',
        },
        {
            dbName: 'Card',
            tableName: 'card_address',
            columnName: 'cc_country',
        },
    ],
};

// Customer

export const customerPK: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'customer_pk',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_client',
            columnName: 'loan_cust_pk',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgagee',
            columnName: 'mort_cust_pk',
        },
        {
            dbName: 'Card',
            tableName: 'card_customer',
            columnName: 'card_cust_pk',
        },
    ],
};

export const customerFirstName: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'customer_first_name',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_client',
            columnName: 'loan_first',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgagee',
            columnName: 'mg_first',
        },
        {
            dbName: 'Card',
            tableName: 'card_customer',
            columnName: 'cc_first',
        },
    ],
};

export const customerLastName: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'customer_last_name',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_client',
            columnName: 'loan_last',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgagee',
            columnName: 'mg_last',
        },
        {
            dbName: 'Card',
            tableName: 'card_customer',
            columnName: 'cc_last',
        },
    ],
};

export const customerBirthDate: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'customer_birth_date',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_client',
            columnName: 'loan_birth',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgagee',
            columnName: 'mg_birth',
        },
        {
            dbName: 'Card',
            tableName: 'card_customer',
            columnName: 'cc_dob',
        },
    ],
};

export const customerGender: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'customer_gender',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_client',
            columnName: 'loan_gen',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgagee',
            columnName: 'mg_gender',
        },
        {
            dbName: 'Card',
            tableName: 'card_customer',
            columnName: 'cc_gender',
        },
    ],
};

export const customerMarriageStatus: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'customer_marriage_status',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_client',
            columnName: 'loan_mar_stat',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mortgagee',
            columnName: 'mg_marital',
        },
        {
            dbName: 'Card',
            tableName: 'card_customer',
            columnName: 'cc_marital',
        },
    ],
};

// Transaction

export const transactionPK: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'transaction_pk',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_payment',
            columnName: 'loan_tran_pk',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_payment',
            columnName: 'mort_tran_pk',
        },
        {
            dbName: 'Card',
            tableName: 'card_transaction',
            columnName: 'card_tran_pk',
        },
    ],
};
export const transactionAccountFK: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'transaction_account_fK',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_payment',
            columnName: 'loan_acct_fk',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_payment',
            columnName: 'mort_acct_fk',
        },
        {
            dbName: 'Card',
            tableName: 'card_transaction',
            columnName: 'card_acct_fk',
        },
    ],
};
export const transactionDate: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'transaction_date',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_payment',
            columnName: 'loan_dat_pmt',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_payment',
            columnName: 'mg_date_pmt',
        },
        {
            dbName: 'Card',
            tableName: 'card_transaction',
            columnName: 'cc_dat_purchase',
        },
    ],
};
export const transactionAmount: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'transaction_amount',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Loan',
            tableName: 'loan_payment',
            columnName: 'loan_amt_pmt',
        },
        {
            dbName: 'Mortgage',
            tableName: 'mort_payment',
            columnName: 'mg_amt_pmt',
        },
        {
            dbName: 'Card',
            tableName: 'card_transaction',
            columnName: 'cc_amt_purchase',
        },
    ],
};
export const transactionCountry: AttributeTestCase = {
    title: 'should create {{name}} attribute',
    name: 'transaction_country',
    assistedSearch: false,
    selectColumns: [
        {
            dbName: 'Card',
            tableName: 'card_transaction',
            columnName: 'cc_tran_country',
        },
    ],
};

// Utils Functions

export function getAllAttributeNames(): string[] {
    const createdAttributeTests: AttributeTestCase[] = [
        // Account
        accountPK,
        accountCustomerFK,
        accountStartDate,
        accountEndDate,
        accountBalance,
        accountDueDate,
        accountStatus,
        accountAmount,
        accountMinPmt,
        accountCreditLimit,
        // Address
        addressPK,
        addressCustomerFK,
        addressStreet,
        addressCity,
        addressZipCode,
        addressState,
        addressCountry,
        // Customer
        customerPK,
        customerFirstName,
        customerLastName,
        customerBirthDate,
        customerGender,
        customerMarriageStatus,
        // Payment
        transactionPK,
        transactionAccountFK,
        transactionDate,
        transactionAmount,
        transactionCountry,
    ];

    return createdAttributeTests.map((attr) => attr.name);
}

export function getEntityAttributeNames(entityName: string): string[] {
    let createdAttributeTests: AttributeTestCase[] = [];

    switch (entityName) {
        case 'Account':
            createdAttributeTests = [
                accountPK,
                accountCustomerFK,
                accountStartDate,
                accountEndDate,
                accountBalance,
                accountDueDate,
                accountStatus,
                accountAmount,
                accountMinPmt,
                accountCreditLimit,
            ];
            break;
        case 'Address':
            createdAttributeTests = [
                addressPK,
                addressCustomerFK,
                addressStreet,
                addressCity,
                addressZipCode,
                addressState,
                addressCountry,
            ];
            break;
        case 'Customer':
            createdAttributeTests = [
                customerPK,
                customerFirstName,
                customerLastName,
                customerBirthDate,
                customerGender,
                customerMarriageStatus,
            ];
            break;
        case 'Transaction':
            createdAttributeTests = [
                transactionPK,
                transactionAccountFK,
                transactionDate,
                transactionAmount,
                transactionCountry,
            ];
            break;

        default:
            break;
    }

    return createdAttributeTests.map((attr) => attr.name);
}
