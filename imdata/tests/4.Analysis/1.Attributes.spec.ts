import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { DB_NAMES } from '../../constants/dbNames';
import { deleteAssertions } from '../../functions/steps/Administration/datasources';
import { attributeDetailAssertions, loginAndGoToAttributesPage } from '../../functions/steps/Analysis/attributes';
import assertByText from '../../functions/utils/assertByText';
import assertList from '../../functions/utils/assertList';
import { clickOnText, clickOnTextLast } from '../../functions/utils/clickOnText';
import { getByAttribute } from '../../functions/utils/getByAttribute';
import { getByIdAndFill } from '../../functions/utils/getByIdAndFill';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';

test.skip('should go to Analysis > Attributes page with ds admin user and delete one by one if exists', async ({
    page,
}) => {
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

const attributeAccountPK = {
    title: 'should create {{name}} attribute',
    name: 'attributeAccountPK',
    assistedSearch: false,
};

const attributeTests = [attributeAccountPK];

attributeTests.forEach((attTest) => {
    const testDescription = attTest.title.replace('{{name}}', attTest.name);

    test(testDescription, async ({ page }) => {
        await loginAndGoToAttributesPage(page, USER_DS_ADMIN);

        await clickOnTextLast(page, 'New');
        await waitForTimeout(page);

        await getByIdAndFill(page, 'name', attTest.name);

        await page.getByRole('switch').uncheck();
        await waitForTimeout(page);

        await assertList(
            page,
            DB_NAMES.map((dbName) => dbName.name)
        );

        for (let index = 0; index < DB_NAMES.length; index++) {
            const dbName = DB_NAMES[index];

            // await clickOnText(page, dbName.name); BUG
            await clickOnText(page, ' chevron_right ');
            await waitForTimeout(page);

            await assertList(page, dbName.tables);
        }

        await page.waitForTimeout(5000);

        // UNCOMPLETED: attributes creation fails with general error currently, so we can´t continue
    });
});
