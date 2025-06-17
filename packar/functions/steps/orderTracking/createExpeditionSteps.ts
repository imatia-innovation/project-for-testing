import { Page } from '@playwright/test';
import { admin, baserUrl, PICKUP_LOCATION, TIMEOUT } from '../../../constants';
import { clickOnElementById, clickOnText, clickOnTextLast } from '../../utils/clickOnText';
import assertList from '../../utils/assertList';
import { getById } from '../../utils/getById';
import logger from '../../utils/logger';
import { acceptOffer, createOrderAndGoToOfferDetailPage } from './courierAcceptRejectOfferSteps';
import OfferTest from '../../../interfaces/OfferTest';
import { getByAttribute } from '../../utils/getByAttribute';
import login from '../login';
import ExpeditionTest from '../../../interfaces/ExpeditionTest';
import ExpeditionTestResult from '../../../interfaces/ExpeditionTestResult';
import OfferTestResult from '../../../interfaces/OfferTestResult';
import { selectRegisterPerPage } from '../../utils/pagination';

export const EXPEDITION_TABLE_COLUMNS = [
    'Expedición',
    'Codigo de Transportista',
    'Transportista',
    'Tipo de Servicio',
    'Almacén',
    'Fecha',
    'Manifiesto',
    'Cerrar',
];

export const NEW_EXPEDITION_TEXTS = [
    'Solicitar Nueva Expedición',
    'Código',
    'Almacén',
    'Transportista',
    'Tipo de Servicio',
    'Fecha',
    'Cancelar',
    'Solicitar',
];

const SELECT_EXPEDITION_ORDERS = ['Seleccione Pedidos para la Expedición', 'Cancelar', 'Guardar'];

export async function createExpedition(page: Page, provider: string): Promise<string> {
    await clickOnText(page, 'Nueva expedición');
    await assertList(page, NEW_EXPEDITION_TEXTS);

    logger.info('createExpeditionSteps.ts createExpedition pickUpLocation:', PICKUP_LOCATION);

    await clickOnElementById(page, 'pickup_location');
    await clickOnTextLast(page, ` ${PICKUP_LOCATION} `);

    logger.info('createExpeditionSteps.ts createExpedition provider:', provider);

    await getById(page, 'courier').click();
    await clickOnTextLast(page, ` ${provider} `);

    const pickupCode = await getById(page, 'pickup_code').inputValue();

    await clickOnTextLast(page, 'Solicitar');

    await page.waitForTimeout(TIMEOUT);

    logger.info('createExpeditionSteps.ts createExpedition', { pickupCode });
    return pickupCode;
}

export async function selectExpedition(page: Page, pickupCode: string): Promise<void> {
    await clickOnText(page, pickupCode);

    await page.waitForTimeout(TIMEOUT);

    await assertList(page, SELECT_EXPEDITION_ORDERS);
}

export async function navigateToClientExpeditionPage(page: Page) {
    await page.goto(baserUrl + '/app/main/pickups');

    await page.waitForURL(baserUrl + '/app/main/pickups');

    await page.waitForTimeout(TIMEOUT);

    await assertList(page, EXPEDITION_TABLE_COLUMNS);
}

export async function createOrdersForExpedition(
    page: Page,
    qtyOrders: number,
    orderTest: OfferTest
): Promise<string[]> {
    let orderReferences: string[] = [];
    for (let i = 0; i < qtyOrders; i++) {
        const { reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, orderTest, i);
        await acceptOffer(page, orderTest.courierHasFixedPrice, orderTest.setPrice);
        orderReferences.push(reference);
    }
    return orderReferences;
}

export async function selectOrders(page: Page) {
    const checkboxLocators = await getByAttribute(page, 'type', 'checkbox').all();

    for (let index = 0; index < checkboxLocators.length; index++) {
        const checkboxLocator = checkboxLocators[index];

        await checkboxLocator.click();
    }
}

export async function createExpeditionWithOrders(
    page: Page,
    expeditionTest: ExpeditionTest,
    qtyOrders: number = 1
): Promise<ExpeditionTestResult> {
    const orderReferences = await createOrdersForExpedition(page, qtyOrders, expeditionTest.order);

    let expeditionCode: string = '';

    if (qtyOrders > 1) {
        await login(page, admin);

        await navigateToClientExpeditionPage(page);

        expeditionCode = await createExpedition(page, expeditionTest.courier.providerName!);

        await page.waitForTimeout(TIMEOUT);

        // select 100 registers per page
        await selectRegisterPerPage(page);

        await selectExpedition(page, expeditionCode);

        await selectOrders(page);

        await clickOnText(page, 'Guardar');

        await clickOnText(page, ' lock_open');
    } else {
        expeditionCode = orderReferences[0];
    }

    return {
        expeditionCode,
        orderReferences,
    };
}
