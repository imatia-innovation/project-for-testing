import { Page } from '@playwright/test';
import assertList from '../utils/assertList';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { getById } from '../utils/getById';
import { TIMEOUT } from '../../constants';

const RETURNS_PAGE: string[] = [
    'Inicio',
    'Devoluciones',
    //
    'Buscar devoluciones',
    'Seleccionar fechas',
    'Nº Referencia Transportista',
    'Transportista',
    'País',
    'Servicio del transportista',
    'Estado',
    'Nº Referencia Cliente',
    'Filtrar',
    'Limpiar',
    //
    'Fecha del envío',
    'Nº Referencia Cliente',
    'Nº Referencia Transportista',
    'País',
    'Transportista',
    'Servicio del Transportista',
    'Nº de bultos',
    'Estado',
];

export async function navigateToReturnsPage(page: Page) {
    const locator = getById(page, 'return');
    await locator.click();

    await waitUntilUrlLoads(page, '/app/main/return');
    await page.waitForTimeout(TIMEOUT);

    await assertReturnsPage(page);
}

export async function assertReturnsPage(page: Page) {
    await assertList(page, RETURNS_PAGE);
}
