import { Page } from '@playwright/test';
import { getColumnNamesByTable, getDbNames, getTableNamesByDB } from '../../../constants/dbNames';
import DBName from '../../../interfaces/DBName';
import User from '../../../interfaces/User';
import assertList from '../../utils/assertList';
import { clickOnText, clickOnTextNth } from '../../utils/clickOnText';
import { getById } from '../../utils/getById';
import { waitForTimeout } from '../../utils/waitforTimeout';
import { homeAssertions } from '../home';
import { login } from '../login';

export async function dataSourceAssertions(page: Page) {
    await assertList(page, [
        'Name',
        'Explore',
        //
        ...getDbNames(),
    ]);
}

export async function dataSourceDetailAssertions(page: Page, db: DBName) {
    await assertList(page, ['HIDE TABLES', db.name, ...getTableNamesByDB(db)]);
}

export async function dataSourceDetailAssertionsColumns(page: Page, db: DBName) {
    const tableNames = getTableNamesByDB(db);

    for (let index = 0; index < tableNames.length; index++) {
        const tableName = tableNames[index];

        if (tableName === 'mortgage') {
            await clickOnTextNth(page, tableName, 1);
        } else {
            await clickOnText(page, tableName);
        }
        await waitForTimeout(page);

        await assertList(page, getColumnNamesByTable(db, tableName));
        await waitForTimeout(page);
    }
}

export async function loginAndGoToDataSourcesPage(page: Page, user: User) {
    await login(page, user);
    await homeAssertions(page, user);

    await getById(page, 'users_datasources-gridItem').click();
    await waitForTimeout(page);
    await dataSourceAssertions(page);
}
