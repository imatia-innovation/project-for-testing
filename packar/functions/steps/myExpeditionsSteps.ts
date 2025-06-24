import { Page } from '@playwright/test';
import assertList from '../utils/assertList';
import assertListExcluded from '../utils/assertListExcluded';
import { getById } from '../utils/getById';
import { waitForTimeout } from '../utils/waitforTimeout';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';

const EXPEDITION_PAGE_ERROR: string[] = [
    ' No se han obtenido resultados ',
    'Error',
    'Error al consultar datos del servidor.',
    'Ok',
];

const MY_EXPEDITION_PAGE = ['Mis expediciones', 'En curso', 'Completadas'];

export async function navigateToMyExpeditionsPage(page: Page) {
    const locator = getById(page, 'my-pickups');
    await locator.click();

    await waitUntilUrlLoads(page, '/app/main/my-pickups');
}

export async function assertMyExpeditionsPageError(page: Page) {
    await waitForTimeout(page);
    await assertList(page, [...MY_EXPEDITION_PAGE, ...EXPEDITION_PAGE_ERROR]);
    await waitForTimeout(page);
}

export async function assertMyExpeditionsPage(page: Page) {
    await waitForTimeout(page);
    await assertList(page, MY_EXPEDITION_PAGE);
    await assertListExcluded(page, EXPEDITION_PAGE_ERROR);
    await waitForTimeout(page);
}
