import { expect, Locator, Page } from '@playwright/test';
import { baserUrl } from '../../../constants';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import ExpeditionTestResult from '../../../interfaces/ExpeditionTestResult';
import assertByText from '../../utils/assertByText';
import assertList from '../../utils/assertList';
import { clickOnText } from '../../utils/clickOnText';
import logger from '../../utils/logger';
import { waitForTimeout } from '../../utils/waitforTimeout';

const MY_EXPEDITIONS_HOME_PAGE: string[] = ['Mis expediciones', 'Dirección recogida', 'Fecha recogida:'];

const MY_EXPEDITIONS_DETAIL_PAGE: string[] = ['Bultos', 'Destino', 'Incidencia', 'Confirmar entrega', 'ASIGNADO'];

const INCIDENCE_MODAL: string[] = [
    'Incidencia',
    'Por favor, indica el motivo de la incidencia.',
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
    await waitForTimeout(page, 2);
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
    //await login(page, courierNOFixedPrice);

    await waitForTimeout(page);

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
    await waitForTimeout(page, 2);

    await clickOnText(page, 'Destino');
    await waitForTimeout(page);

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
    await waitForTimeout(page);

    await clickOnText(page, 'Destino');
    await waitForTimeout(page);
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

    await waitForTimeout(page);
    await clickOnText(page, 'Destino');
    await waitForTimeout(page, 2);
}

export async function selectReceivedStatus(page: Page) {
    const orderIndex: number = 0; // first order
    const statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);
}

export async function selectOnRouteStatus(page: Page) {
    const orderIndex: number = 0; // first order
    const statusIndex: number = 2; // on route

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.ON_ROUTE);
}

export async function selectSentStatus(page: Page, expeditionReferences?: ExpeditionTestResult) {
    const confirmDeliveryTextLocator: Locator = page.getByText('Confirmar entrega');
    const confirmDeliveryBtnLocators: Locator[] = await confirmDeliveryTextLocator.all();
    logger.info('orderExpeditionTrackingSteps.ts Incidence buttons number: ', confirmDeliveryBtnLocators.length);

    if (expeditionReferences) {
        expect(confirmDeliveryBtnLocators.length).toEqual(expeditionReferences.orderReferences.length);
    }

    await confirmDeliveryBtnLocators[0].click();
    await confirmDeliveryModalAssertions(page);

    await page.getByText('DNI').nth(0).fill('03915150K');
    await clickOnText(page, 'Guardar');

    await waitForTimeout(page);

    await assertByText(page, ORDER_STATUS.SENT);
}

export async function changeOfferStatus(page: Page, setStatus: string, expeditionReferences?: ExpeditionTestResult) {
    switch (setStatus) {
        case ORDER_STATUS.RECEIVED:
            await selectReceivedStatus(page);
            break;
        case ORDER_STATUS.ON_ROUTE:
            await selectReceivedStatus(page);
            await selectOnRouteStatus(page);
            break;
        case ORDER_STATUS.SENT:
            await selectReceivedStatus(page);
            await selectOnRouteStatus(page);
            await selectSentStatus(page, expeditionReferences);
            break;
        default:
            break;
    }
}
