import { Page } from '@playwright/test';
import assertList from '../utils/assertList';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { getById } from '../utils/getById';
import { EXPEDITION_TABLE_COLUMNS } from './orderTracking/createExpeditionSteps';

const EXPEDITION_PAGE: string[] = [
    'Inicio',
    'Expediciones',
    //
    'Nueva expedición',
    'Registros por página',
];

export async function navigateToExpeditionsPage(page: Page) {
    const locator = getById(page, 'pickups');
    await locator.click();

    await waitUntilUrlLoads(page, '/app/main/pickups');

    await assertExpeditionsPage(page);
}

export async function assertExpeditionsPage(page: Page) {
    await assertList(page, EXPEDITION_PAGE);

    await assertList(page, EXPEDITION_TABLE_COLUMNS);
}
