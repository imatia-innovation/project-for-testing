import { Page } from '@playwright/test';
import assertList from '../utils/assertList';
import { clickOnText } from '../utils/clickOnText';
import { getById } from '../utils/getById';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';

const DESTINATIONS_PAGE: string[] = [
    'Inicio',
    'Destinos',
    //
    'Destinos Favoritos',
    'Nuevo',
    'Eliminar',
    //
    'Nombre de Destino',
    'Nombre de Dirección',
    'Dirección',
    'Localidad',
    'Código postal',
    'Mail',
    'País',
    'Teléfono',
    'Teléfono Secundario',
    'Observaciones',
    //
    'Registros por página',
];

const NEW_DESTINATION_FORM = [
    'Destinos Favoritos',
    'Nuevo',
    'Nombre de Destino',
    'Nombre de Dirección',
    'Mail',
    'Teléfono',
    'Teléfono Secundario',
    'Dirección',
    'Código postal',
    'Localidad',
    'País',
    'Observaciones',
];

export async function navigateToDestinationsPage(page: Page) {
    const locator = getById(page, 'destinations');
    await locator.click();

    await waitUntilUrlLoads(page, '/app/main/destinations');

    await assertDestinationsPage(page);
}

export async function assertDestinationsPage(page: Page) {
    await assertList(page, DESTINATIONS_PAGE);
}

export async function assertNewDestinationForm(page: Page) {
    await clickOnText(page, 'Nuevo');

    await assertList(page, NEW_DESTINATION_FORM);
}
