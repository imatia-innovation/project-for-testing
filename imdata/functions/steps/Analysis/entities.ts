import { Page } from '@playwright/test';
import { CARD_TABLES, LOAN_TABLES, MORTGAGE_TABLES } from '../../../constants/dbNames';
import User from '../../../interfaces/User';
import assertList from '../../utils/assertList';
import { getById } from '../../utils/getById';
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
        //
        ...LOAN_TABLES,
        ...CARD_TABLES,
        ...MORTGAGE_TABLES,
    ]);
}

export async function loginAndGoToEntitiesPage(page: Page, user: User) {
    await login(page, user);
    await homeAssertions(page, user);

    await getById(page, 'entities-gridItem').click();
    await waitForTimeout(page);
    await entitiesAssertions(page);
}

export async function createNewEntity(page: Page) {}
