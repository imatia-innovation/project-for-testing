import { Page } from '@playwright/test';
import User from '../../../interfaces/User';
import assertList from '../../utils/assertList';
import { getById } from '../../utils/getById';
import { waitForTimeout } from '../../utils/waitforTimeout';
import { homeAssertions } from '../home';
import { login } from '../login';

export async function singleViewAssertions(page: Page) {
    await assertList(page, ['Export Single View']);
}

export async function singleViewDetailAssertions(page: Page) {
    await assertList(page, []);
}

export async function loginAndGoToSingleViewPage(page: Page, user: User) {
    await login(page, user);
    await homeAssertions(page, user);

    await getById(page, 'singleView-gridItem').click();
    await waitForTimeout(page);
    await singleViewAssertions(page);
}
