import { Locator, Page } from '@playwright/test';
import { baserUrl, courierNOFixedPrice, TIMEOUT } from '../../../constants';
import assertList from '../../utils/assertList';
import ExpeditionTestResult from '../../../interfaces/ExpeditionTestResult';
import login from '../login';
import { clickOnText } from '../../utils/clickOnText';
import logger from '../../utils/logger';

const MY_EXPEDITIONS_HOME_PAGE: string[] = ['Mis expediciones', 'Dirección recogida', 'Fecha recogida:'];

const MY_EXPEDITIONS_DETAIL_PAGE: string[] = ['Bultos', 'Destino', 'Incidencia', 'Confirmar entrega'];

const INCIDENCE_MODAL: string[] = [
    'Incidencia',
    'Por favor, revisa la información ingresada. Asegúrate de que todos los datos son correctos.',
    'Motivo incidencia',
    'Cancelar',
    'Guardar',
];

const CONFIRM_DELIVERY_MODAL: string[] = [
    'Entrega',
    'Por favor, revisa la información ingresada. Asegúrate de que todos los datos son correctos.',
    'DNI',
    'Cancelar',
    'Guardar',
];

const STATUS_COMBOBOX: string[] = ['ASIGNADO', 'RECOGIDO', 'EN RUTA'];

export async function navigateToExpeditionHomePage(page: Page): Promise<void> {
    await page.goto(baserUrl + '/app/main/my-pickups');
    await page.waitForURL(baserUrl + '/app/main/my-pickups');
    await page.waitForTimeout(TIMEOUT);
}

export async function myExpeditionsHomePageAssertions(
    page: Page,
    expeditionReferences: ExpeditionTestResult
): Promise<void> {
    await assertList(page, MY_EXPEDITIONS_HOME_PAGE);

    const dynamicValues = [expeditionReferences.expeditionCode, ' Envíos'];
    await assertList(page, dynamicValues);
}

export async function expeditionHomePageRoutine(page: Page, expeditionReferences: ExpeditionTestResult): Promise<void> {
    await login(page, courierNOFixedPrice);
    await navigateToExpeditionHomePage(page);

    await myExpeditionsHomePageAssertions(page, expeditionReferences);
}

export async function myExpeditionsDetailPageAssertions(
    page: Page,
    expeditionReferences: ExpeditionTestResult
): Promise<void> {
    await assertList(page, MY_EXPEDITIONS_DETAIL_PAGE);

    const dynamicValues = [expeditionReferences.expeditionCode, ...expeditionReferences.orderReferences];
    await assertList(page, dynamicValues);
}

export async function expeditionDetailPageRoutine(
    page: Page,
    expeditionReferences: ExpeditionTestResult
): Promise<void> {
    await expeditionHomePageRoutine(page, expeditionReferences);

    await clickOnText(page, expeditionReferences.expeditionCode);
    await page.waitForURL((url: any) => url != baserUrl + '/app/main/my-pickups', {
        waitUntil: 'load',
    });
    await page.waitForTimeout(TIMEOUT);

    await myExpeditionsDetailPageAssertions(page, expeditionReferences);
}

export async function incidenceModalAssertions(page: Page): Promise<void> {
    await assertList(page, INCIDENCE_MODAL);
}

export async function statusComboboxAssertions(page: Page): Promise<void> {
    await assertList(page, STATUS_COMBOBOX);
}

export async function selectOrderAndStatus(page: Page, orderIndex: number, statusIndex: number): Promise<void> {
    const comboboxLocator: Locator = page.getByRole('combobox');
    const comboboxLocators: Locator[] = await comboboxLocator.all();
    logger.info('orderExpeditionTrackingSteps.ts comboboxLocators: ', comboboxLocators.length);

    await comboboxLocators[orderIndex].click();
    await statusComboboxAssertions(page);

    const optionLocator: Locator = page.getByRole('option');
    const optionLocators: Locator[] = await optionLocator.all();
    logger.info('orderExpeditionTrackingSteps.ts optionLocators: ', optionLocators.length);

    await optionLocators[statusIndex].click();
    await page.waitForTimeout(TIMEOUT);
}

export async function confirmDeliveryModalAssertions(page: Page): Promise<void> {
    await assertList(page, CONFIRM_DELIVERY_MODAL);
}

export async function saveIncidence(page: Page, incidenceIndex: number, incidenceText: string): Promise<void> {
    const incidenceTextLocator: Locator = page.getByText('Incidencia');
    const incidenceBtnLocators: Locator[] = await incidenceTextLocator.all();
    logger.info('orderExpeditionTrackingSteps.ts Incidence buttons number: ', incidenceBtnLocators.length);

    await incidenceBtnLocators[incidenceIndex].click();
    await incidenceModalAssertions(page);

    await page.getByText('Motivo incidencia').nth(0).fill(incidenceText);
    await clickOnText(page, 'Guardar');

    await page.waitForTimeout(TIMEOUT);
}
