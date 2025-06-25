import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { entityAccount, entityAddress, entityCustomer, entityTransaction } from '../../constants/entitiesTestCases';
import { deleteAssertions } from '../../functions/steps/Administration/datasources';
import {
    createNewEntity,
    entityDetailAssertions,
    loginAndGoToEntitiesPage,
} from '../../functions/steps/Analysis/entities';
import assertByText from '../../functions/utils/assertByText';
import { clickOnText } from '../../functions/utils/clickOnText';
import { getByAttribute } from '../../functions/utils/getByAttribute';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import { EntityTestCase } from '../../interfaces/EntityTestCase';

test.skip('should go to Analysis > Entities page ds admin user', async ({ page }) => {
    await loginAndGoToEntitiesPage(page, USER_DS_ADMIN);

    let entityCardLocator = getByAttribute(page, 'class', 'entity-data');
    let qtyEntities = (await entityCardLocator.all()).length;

    logger.info('  1.Attributes.spec.ts qtyRows: ', qtyEntities);
});

test('should go to Analysis > Entities and delete all if exists', async ({ page }) => {
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

const entityTests: EntityTestCase[] = [entityAccount, entityAddress, entityCustomer, entityTransaction];

entityTests.forEach((entityTest) => {
    const testDescription = entityTest.title.replace('{{name}}', entityTest.name);

    test(testDescription, async ({ page }) => {
        await loginAndGoToEntitiesPage(page, USER_DS_ADMIN);

        test.slow();

        await createNewEntity(page, entityTest);

        await assertByText(page, entityAccount.name);
    });
});
