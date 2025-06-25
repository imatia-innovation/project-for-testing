import test, { Locator } from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { DB_NAMES } from '../../constants/dbNames';
import { deleteAssertions } from '../../functions/steps/Administration/datasources';
import { attributeDetailAssertions, loginAndGoToAttributesPage } from '../../functions/steps/Analysis/attributes';
import assertByText from '../../functions/utils/assertByText';
import assertList from '../../functions/utils/assertList';
import { clickOnText, clickOnTextLast, clickOnTextNth } from '../../functions/utils/clickOnText';
import { getByAttribute } from '../../functions/utils/getByAttribute';
import { getByIdAndFill } from '../../functions/utils/getByIdAndFill';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import { AttributeTestCase } from '../../interfaces/AttributeTestCase';

test('should go to Analysis > Attributes page with ds admin user', async ({ page }) => {
    await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

    let attributeLocator = getByAttribute(page, 'class', 'attribute-name');
    let qtyAttributes = (await attributeLocator.all()).length;

    logger.info('  1.Attributes.spec.ts qtyRows: ', qtyAttributes);
});

test.skip('should go to the Analysis > Attributes page and delete all if exists', async ({ page }) => {
    await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

    let attributeLocator = getByAttribute(page, 'class', 'attribute-name');
    let qtyAttributes = (await attributeLocator.all()).length;

    logger.info('  1.Attributes.spec.ts qtyRows: ', qtyAttributes);

    test.slow();

    // Clean
    for (let index = qtyAttributes; index > 0; index--) {
        await attributeLocator.first().click();
        await waitForTimeout(page);
        await attributeDetailAssertions(page);

        await clickOnText(page, 'Delete');

        await waitForTimeout(page);
        await deleteAssertions(page);
        await clickOnText(page, 'Ok');
        await waitForTimeout(page);

        logger.info('  1.Attributes.spec.ts qtyAttributes: ', qtyAttributes);
    }

    await assertByText(page, 'No results found');
});

const attributeTests: AttributeTestCase[] = [
    // // Account
    // accountPK,
    // accountCustomerFK,
    // accountStartDate,
    // accountEndDate,
    // accountBalance,
    // accountDueDate,
    // accountStatus,
    // accountAmount,
    // // Address
    // addressPK,
    // addressCustomerFK,
    // addressStreet,
    // addressCity,
    // addressZipCode,
    // addressState,
    // addressCountry,
    // // Customer
    // customerPK,
    // customerFirstName,
    // customerLastName,
    // customerBirthDate,
    // customerGender,
    // customerMarriageStatus,
    // // Payment
    // transactionPK,
    // transactionAccountFK,
    // transactionDate,
    // transactionAmount,
];

attributeTests.forEach((attTest) => {
    const testDescription = attTest.title.replace('{{name}}', attTest.name);

    test.skip(testDescription, async ({ page }) => {
        await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

        await clickOnTextLast(page, 'New');
        await waitForTimeout(page);

        await getByIdAndFill(page, 'name', attTest.name);

        test.slow();

        if (attTest.assistedSearch) {
        } else {
            await page.getByRole('switch').uncheck();
            await waitForTimeout(page);

            await assertList(
                page,
                DB_NAMES.map((dbName) => dbName.name) // watch only dbNames
            );

            for (let index = 0; index < DB_NAMES.length; index++) {
                const chevronRightLocator: Locator = page.getByText(' chevron_right ');

                const chevronRightLocators: Locator[] = await chevronRightLocator.all();
                logger.info(' 1.Attributes.spec.ts ', {
                    index,
                    chevronRightQty: chevronRightLocators.length,
                });

                await chevronRightLocator.nth(chevronRightLocators.length - 1).click();
                await waitForTimeout(page);
            }

            for (let index = 0; index < DB_NAMES.length; index++) {
                const dbName = DB_NAMES[index];

                const tableNames = dbName.tables.map((t) => t.name);

                await assertList(page, tableNames); // watch only all tableNames

                const selectColumn = attTest.selectColumns[index];

                if (selectColumn.tableName === 'mortgage') {
                    await clickOnTextNth(page, selectColumn.tableName, 1);
                } else {
                    await clickOnText(page, selectColumn.tableName);
                }
                await waitForTimeout(page);

                // Assertions of columns
                const filteredTableCol = dbName.tables
                    .map((table) => table)
                    .filter((tableCol) => tableCol.name === selectColumn.tableName)
                    .pop();
                const columns = filteredTableCol?.columns || [];
                logger.info(' 1.Attributes.spec.ts ', {
                    filteredTableCol,
                    columns,
                });
                await assertList(page, columns);

                await clickOnText(page, selectColumn.columnName);
                await waitForTimeout(page);
            }

            await clickOnText(page, 'Ok');
            await waitForTimeout(page);

            await assertByText(page, attTest.name);
            await waitForTimeout(page);
        }
    });
});

test('should go to Analysis > Attributes page with ds admin user and watch all created attributes', async ({
    page,
}) => {
    await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

    let attributeLocator = getByAttribute(page, 'class', 'attribute-name');
    let qtyAttributes = (await attributeLocator.all()).length;

    logger.info('  1.Attributes.spec.ts qtyRows: ', qtyAttributes);

    for (let index = 0; index < attributeTests.length; index++) {
        const attributeTest = attributeTests[index];

        await assertByText(page, attributeTest.name);
    }
});
