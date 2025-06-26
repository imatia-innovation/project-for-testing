import { Locator, Page } from '@playwright/test';
import { getAllAttributeNames } from '../../../constants/attributesTestCases';
import { getAllTableNames } from '../../../constants/dbNames';
import { EntityTestCase } from '../../../interfaces/EntityTestCase';
import User from '../../../interfaces/User';
import assertList from '../../utils/assertList';
import { clickOnText, clickOnTextLast } from '../../utils/clickOnText';
import { getById } from '../../utils/getById';
import { getByIdAndFill } from '../../utils/getByIdAndFill';
import logger from '../../utils/logger';
import { waitForTimeout } from '../../utils/waitforTimeout';
import { homeAssertions } from '../home';
import { login } from '../login';

export async function entitiesAssertions(page: Page) {
    await assertList(page, ['New', 'Create Single View']);
}

export async function entityDetailAssertions(page: Page) {
    await assertList(page, [
        'Delete',
        'Save',
        //
        'Tables',
        'Related entities',
        //
        'Attributes',
        'Tables',
        'Included',
        'Name',
        'Attributes present in table',
        'Available',
    ]);
}

export async function loginAndGoToEntitiesPage(page: Page, user: User) {
    await login(page, user);
    await homeAssertions(page, user);

    await getById(page, 'entities-gridItem').click();
    await waitForTimeout(page);
    await entitiesAssertions(page);
}

export async function createNewEntity(page: Page, entityTest: EntityTestCase) {
    await clickOnTextLast(page, 'New');
    await waitForTimeout(page);

    await getByIdAndFill(page, 'name', entityTest.name);
    await waitForTimeout(page);

    await assertList(page, [...getAllTableNames(), ...getAllAttributeNames()]);

    let plusCircleLocator: Locator;
    let plusCircleLocators: Locator[];

    logger.info(' 2.Entities.spec.ts entityTest ', entityTest.attributes);

    for (let index = 0; index < entityTest.attributes.repeatTimes; index++) {
        plusCircleLocator = page.getByText('add_circle');
        plusCircleLocators = await plusCircleLocator.all();

        logger.info(' 2.Entities.spec.ts plusCircleLocators.length: ', plusCircleLocators.length);
        logger.info(' 2.Entities.spec.ts entityTest.attributes.position: ', entityTest.attributes.position);

        await plusCircleLocator.nth(entityTest.attributes.position).click();
    }

    logger.info(' 2.Entities.spec.ts entityTest ', entityTest.tables);

    for (let index = 0; index < entityTest.tables.repeatTimes; index++) {
        plusCircleLocator = page.getByText('add_circle');
        plusCircleLocators = await plusCircleLocator.all();

        logger.info(' 2.Entities.spec.ts plusCircleLocators.length: ', plusCircleLocators.length);
        logger.info(' 2.Entities.spec.ts entityTest.tables.position: ', entityTest.tables.position);

        await plusCircleLocator.nth(entityTest.tables.position).click();
    }

    await clickOnText(page, 'Ok');
    await waitForTimeout(page);
}
