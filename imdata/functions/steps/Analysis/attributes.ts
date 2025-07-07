import { Locator, Page } from '@playwright/test';
import { DB_NAMES, getColumnNamesByTable, getDbNames, getTableNamesByDB } from '../../../constants/dbNames';
import { AttributeTestCase } from '../../../interfaces/AttributeTestCase';
import DBName from '../../../interfaces/DBName';
import User from '../../../interfaces/User';
import assertByText from '../../utils/assertByText';
import assertList from '../../utils/assertList';
import { clickOnText, clickOnTextNth } from '../../utils/clickOnText';
import { getById } from '../../utils/getById';
import logger from '../../utils/logger';
import { selectRegisterPerPage } from '../../utils/pagination';
import { waitForTimeout } from '../../utils/waitforTimeout';
import { homeAssertions } from '../home';
import { login } from '../login';

export async function attributesAssertions(page: Page) {
    await assertList(page, ['New']);
}

export async function attributeDetailAssertions(page: Page) {
    await assertList(page, [
        'Delete',
        'Save',
        //
        'Attribute detail',
        'Assisted search',
        'Search',
    ]);
}

export async function loginAndGoToAttributesPage(page: Page, user: User) {
    await login(page, user);
    await homeAssertions(page, user);

    await getById(page, 'attributes-gridItem').click();
    await waitForTimeout(page);
    await attributesAssertions(page);
}

export async function createAttribute(page: Page, attTest: AttributeTestCase) {
    logger.info(' Start attributes.ts createAttribute ');
    if (attTest.assistedSearch) {
        // TODO here should be tested the assisted search
    } else {
        await page.getByRole('switch').uncheck();
        await waitForTimeout(page);

        await assertList(page, getDbNames());

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

        logger.info(' Start attributes.ts createAttribute 2nd forloop');

        for (let index = 0; index < DB_NAMES.length; index++) {
            const dbName: DBName = DB_NAMES[index];
            await assertList(page, getTableNamesByDB(dbName));

            const selectColumn = attTest.selectColumns[index]; // this is an object
            logger.info('   attributes.ts createAttribute 2nd for loop', { selectColumn });
            if (!selectColumn) continue;

            if (selectColumn.tableName === 'mortgage') {
                await clickOnTextNth(page, selectColumn.tableName, 1);
            } else {
                await clickOnText(page, selectColumn.tableName);
            }
            await waitForTimeout(page);

            //Assertions of columns
            const columns = getColumnNamesByTable(dbName, selectColumn.tableName);
            await assertList(page, columns);

            await clickOnText(page, selectColumn.columnName);
            await waitForTimeout(page);
        }

        logger.info(' Finish attributes.ts createAttribute 2nd forloop');

        await clickOnText(page, 'Ok');
        await waitForTimeout(page);

        const errorMessageCount = await page
            .getByText(`There is already an attribute with the name ${attTest.name}`)
            .count();
        if (errorMessageCount === 0) {
            const attrNameCount = await page.getByText(attTest.name).count();
            if (attrNameCount === 0) {
                await selectRegisterPerPage(page);
            }
            await waitForTimeout(page);

            await assertByText(page, attTest.name);
            await waitForTimeout(page);
            logger.info(' Finish attributes.ts createAttribute ');
        } else {
            await clickOnTextNth(page, 'Ok', 1);
            await waitForTimeout(page);
        }
    }
}
