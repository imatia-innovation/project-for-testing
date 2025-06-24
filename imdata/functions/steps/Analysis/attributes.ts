import { Page } from '@playwright/test';
import User from '../../../interfaces/User';
import assertList from '../../utils/assertList';
import { getById } from '../../utils/getById';
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

export async function createNewAttribute(page: Page) {}
