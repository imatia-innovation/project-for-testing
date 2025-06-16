import { Page } from '@playwright/test';
import assertList from '../utils/assertList';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { getById } from '../utils/getById';
import { clickOnText } from '../utils/clickOnText';

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
    'Codigo postal', // Bug
    'Email',
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
    'Codigo postal',
    'Población',
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
