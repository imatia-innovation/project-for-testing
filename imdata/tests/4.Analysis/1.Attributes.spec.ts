import test, { Locator } from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import {
    accountAmount,
    accountBalance,
    accountCreditLimit,
    accountCustomerFK,
    accountDueDate,
    accountEndDate,
    accountMinPmt,
    accountPK,
    accountStartDate,
    accountStatus,
    addressCity,
    addressCountry,
    addressCustomerFK,
    addressPK,
    addressState,
    addressStreet,
    addressZipCode,
    customerBirthDate,
    customerFirstName,
    customerGender,
    customerLastName,
    customerMarriageStatus,
    customerPK,
    transactionAccountFK,
    transactionAmount,
    transactionCountry,
    transactionDate,
    transactionPK,
} from '../../constants/attributesTestCases';
import { deleteAssertions } from '../../functions/steps/Administration/datasources';
import {
    attributeDetailAssertions,
    createAttribute,
    loginAndGoToAttributesPage,
} from '../../functions/steps/Analysis/attributes';
import assertByText from '../../functions/utils/assertByText';
import { clickOnText, clickOnTextLast } from '../../functions/utils/clickOnText';
import { getByIdAndFill } from '../../functions/utils/getByIdAndFill';
import logger from '../../functions/utils/logger';
import { selectRegisterPerPage } from '../../functions/utils/pagination';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import { AttributeTestCase } from '../../interfaces/AttributeTestCase';

test('should go to Analysis > Attributes page with ds admin user', async ({ page }) => {
    await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

    let attributeLocator = page.getByRole('row');
    let qtyAttributes = (await attributeLocator.all()).length;
    logger.info('  1.Attributes.spec.ts qtyRows: ', qtyAttributes);
});

test('should go to the Analysis > Attributes page and delete all if exists', async ({ page }) => {
    await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

    let attributeLocator = page.getByRole('row');
    let qtyAttributes = (await attributeLocator.all()).length;
    const rowText = await attributeLocator.allInnerTexts();
    logger.info('  1.Attributes.spec.ts ', { qtyAttributes, rowText });

    test.slow();

    test.slow();

    // Clean
    for (let index = qtyAttributes; index > 0; index--) {
        attributeLocator = page.getByRole('row');
        qtyAttributes = (await attributeLocator.all()).length;
        logger.info('  1.Attributes.spec.ts qtyRows: ', qtyAttributes);

        const rowLocator: Locator = attributeLocator.nth(1);
        const rowTexts: string[] = await rowLocator.allInnerTexts();

        const skipThisRow: boolean = rowTexts.reduce((prev, text) => {
            return text === 'filter_alt\nName' || text === 'No results found';
        }, false);

        if (skipThisRow) {
            continue;
        }

        await rowLocator.click();
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

attributeTests.forEach((attTest) => {
    const testDescription = attTest.title.replace('{{name}}', attTest.name);

    test(testDescription, async ({ page }) => {
        await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

        await clickOnTextLast(page, 'New');
        await waitForTimeout(page);

        await getByIdAndFill(page, 'name', attTest.name);

        test.slow();

        await createAttribute(page, attTest);
    });
});

test('should go to Analysis > Attributes page with ds admin user and watch all created attributes', async ({
    page,
}) => {
    await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

    let attributeLocator = page.getByRole('row');
    let qtyAttributes = (await attributeLocator.all()).length;
    logger.info('  1.Attributes.spec.ts qtyRows: ', qtyAttributes);

    await selectRegisterPerPage(page);

    for (let index = 0; index < qtyAttributes - 2; index++) {
        const attributeTest = attributeTests[index];

        await assertByText(page, attributeTest.name);
    }
});
