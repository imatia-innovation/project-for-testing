import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { getAllEntitiesNames } from '../../constants/entitiesTestCases';
import {
    singleViewAccount,
    singleViewAddress,
    singleViewCustomer,
    singleViewTransaction,
} from '../../constants/singleViewTestCases';
import { loginAndGoToSingleViewPage } from '../../functions/steps/Analysis/singleView';
import assertList from '../../functions/utils/assertList';
import { clickOnTextLast, clickOnTextNth } from '../../functions/utils/clickOnText';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';

test.skip('should go to Analysis > DataSources page with ds admin user and make assertions without Entities created', async ({
    page,
}) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);
});

test('should go to Analysis > DataSources page with ds admin user and make assertions with Entities created', async ({
    page,
}) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    const resultNotFoundCount = await page.getByText('No results found').count();
    logger.info(' 3.SingleView.spec.ts resultNotFoundCount:', resultNotFoundCount);
    if (resultNotFoundCount === 0) {
        await assertList(page, ['Export Single View', ...getAllEntitiesNames()]);
    }
});

const singleViewTestCases = [singleViewAccount, singleViewAddress, singleViewCustomer, singleViewTransaction];

singleViewTestCases.forEach((singleViewTestCase) => {
    test(`should make assertions in the ${singleViewTestCase.name} Single View`, async ({ page }) => {
        await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

        await assertList(page, ['Export Single View', ...getAllEntitiesNames()]);

        await clickOnTextLast(page, singleViewTestCase.name);
        await waitForTimeout(page, 2);

        await assertList(page, [
            singleViewTestCase.name,
            'Find duplicates',
            //
            ...singleViewTestCase.attributes,
        ]);
    });
});

test('should make assertion on Single View Account first register', async ({ page }) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    await clickOnTextNth(page, 'Account', 1);
    await waitForTimeout(page, 3);

    await page.getByRole('row').nth(1).click();
    await waitForTimeout(page);

    await assertList(page, [
        'Account',
        'Account Entity Data',
        'account_credit_limit',
        'account_pk',
        'account_start_date',
        'account_balance',
        'account_amount',
        'account_min_pmt',
        'account_status',
        'account_end_date',
        'account_due_date',
        'account_customer_fk',
        //
        'Related data',
        'Related Entities',
        'Transaction',
        'Customer',
        //
        'Source data',
        'Datasource',
        'Tables',
    ]);
});

test('should make assertion on Single View Address first register', async ({ page }) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    await clickOnTextNth(page, 'Address', 0);
    await waitForTimeout(page, 3);

    await page.getByRole('row').nth(1).click();
    await waitForTimeout(page);

    await assertList(page, [
        'Address',
        'Address Entity Data',
        'address_street',
        'address_country',
        'address_zip_code',
        'address_state',
        'address_pk',
        'address_customer_fk',
        'address_city',
        //
        'Related data',
        'Related Entities',
        'Customer',
        //
        'Source data',
        'Datasource',
        'Tables',
    ]);
});

test('should make assertion on Single View Customer first register', async ({ page }) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    await clickOnTextNth(page, 'Customer', 0);
    await waitForTimeout(page, 3);

    await page.getByRole('row').nth(1).click();
    await waitForTimeout(page);

    await assertList(page, [
        'Customer',
        'Customer Entity Data',
        'customer_birth_date',
        'customer_last_name',
        'customer_first_name',
        'customer_pk',
        'customer_marriage_status',
        'customer_gender',
        //
        'Related data',
        'Related Entities',
        'Account',
        'Address',
        //
        'Source data',
        'Datasource',
        'Tables',
    ]);
});

test('should make assertion on Single View Transaction first register', async ({ page }) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    await clickOnTextNth(page, 'Transaction', 0);
    await waitForTimeout(page, 3);

    await page.getByRole('row').nth(1).click();
    await waitForTimeout(page);

    await assertList(page, [
        'Transaction',
        'Transaction Entity Data',
        'transaction_pk',
        'transaction_date',
        'transaction_amount',
        'transaction_account_fK',
        'transaction_country',
        //
        'Related data',
        'Related Entities',
        'Account',
        //
        'Source data',
        'Datasource',
        'Tables',
    ]);
});
