import { Page } from '@playwright/test';
import { DB_NAMES } from '../../../constants/dbNames';
import DBName from '../../../interfaces/DBName';
import User from '../../../interfaces/User';
import assertList from '../../utils/assertList';
import { getById } from '../../utils/getById';
import { waitForTimeout } from '../../utils/waitforTimeout';
import { homeAssertions } from '../home';
import { login } from '../login';

export async function dataSourceAssertions(page: Page) {
    await assertList(page, [
        'Name',
        'Explore',
        //
        ...DB_NAMES.map((db) => db.name),
    ]);
}

export async function dataSourceDetailAssertions(page: Page, db: DBName) {
    await assertList(page, ['HIDE TABLES', db.name, ...db.tables]);
}

export async function loginAndGoToDataSourcesPage(page: Page, user: User) {
    await login(page, user);
    await homeAssertions(page, user);

    await getById(page, 'users_datasources-gridItem').click();
    await waitForTimeout(page);
    await dataSourceAssertions(page);
}
