import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { deleteAssertions } from '../../functions/steps/Administration/datasources';
import { entityDetailAssertions, loginAndGoToEntitiesPage } from '../../functions/steps/Analysis/entities';
import assertByText from '../../functions/utils/assertByText';
import { clickOnText, clickOnTextLast } from '../../functions/utils/clickOnText';
import { getByAttribute } from '../../functions/utils/getByAttribute';
import { getByIdAndFill } from '../../functions/utils/getByIdAndFill';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';

test('should go to Analysis > Entities page with ds admin user and delete one by one if exists', async ({ page }) => {
    await loginAndGoToEntitiesPage(page, USER_DS_ADMIN);

    let entityCardLocator = getByAttribute(page, 'class', 'entity-data');
    let qtyEntities = (await entityCardLocator.all()).length;

    logger.info('  1.Attributes.spec.ts qtyRows: ', qtyEntities);

    test.slow();

    // Clean
    for (let index = qtyEntities; index > 0; index--) {
        await entityCardLocator.first().click();
        await waitForTimeout(page);
        await entityDetailAssertions(page);

        await clickOnText(page, 'Delete');

        await waitForTimeout(page);
        await deleteAssertions(page);
        await clickOnText(page, 'Ok');
        await waitForTimeout(page);

        logger.info('  2.Entities.spec.ts qtyEntities: ', qtyEntities);
    }

    await assertByText(page, 'No results found');
});

const entityAccount = {
    title: 'should create {{name}} entity',
    name: 'Account',
};

const entityTests = [entityAccount];

entityTests.forEach((entityTest) => {
    const testDescription = entityTest.title.replace('{{name}}', entityTest.name);

    test(testDescription, async ({ page }) => {
        await loginAndGoToEntitiesPage(page, USER_DS_ADMIN);

        await clickOnTextLast(page, 'New');
        await waitForTimeout(page);

        await getByIdAndFill(page, 'name', entityTest.name);

        await page.waitForTimeout(5000);

        // UNCOMPLETED: attributes creation fails with general error currently, so we can´t continue
    });
});
