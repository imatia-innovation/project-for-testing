// Get Order id
// Login as courier and accept one order
// Login as courier and accept the same order with other price
// Reject order

import { Page } from '@playwright/test';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import { clickOnElementById, clickOnText } from '../../utils/clickOnText';
import { assertTextInRow, createNewOrder } from '../ordersSteps';
import logger from '../../utils/logger';
import assertList from '../../utils/assertList';
import assertListExcluded from '../../utils/assertListExcluded';
import { baserUrl, TIMEOUT } from '../../../constants';
import login, { loginAfterLogout } from '../login';
import OfferTest from '../../../interfaces/OfferTest';
import User from '../../../interfaces/User';
import { getByIdAndFill } from '../../utils/getByIdAndFill';
import logout from '../../utils/logout';

const LABELS_AND_COLUMNS: string[] = [
    'Nº REFERENCIA CLIENTE:',
    'Información de recogida',
    'Fecha de recogida estimada',
    'Precio:',
    'Fecha de respuesta:',
    'Características de la mercancía',
    'Tipo de mercancia:',
    'Paquetería',
    'Nº bulto',
    'Ancho',
    'Alto',
    'Largo',
    'Peso',
    'Registros por página',
    'Datos del remitente',
    'Nombre de la empresa',
    'Dirección:',
    'Localidad:',
    'País:',
    'Correo Electrónico:',
    'Notas/Observaciones:',
    'C.P:',
    'Teléfono:',
    'Respuesta',
    'Introduce tu oferta para llevar este envío',
    'Precio',
    'Rechazar',
    'Aceptar',
];

const LABELS_AND_COLUMNS_DRIVER: string[] = [
    'Datos del transporte',
    'Conductor',
    'Añadir otro conductor',
    'Conductor',
    'Matricula',
    'Añadir otra matricula',
    'Matricula',
    'Guardar',
];

const LABELS_AND_COLUMNS_FIXED_PRICE: string[] = [
    'Nº REFERENCIA CLIENTE:',
    'Información de recogida',
    'Fecha de recogida estimada',
    'Precio:',
    'Fecha de respuesta:',
    'Características de la mercancía',
    'Tipo de mercancia:',
    'Paquetería',
    'Nº bulto',
    'Ancho',
    'Alto',
    'Largo',
    'Peso',
    'Registros por página',
    'Datos del remitente',
    'Nombre de la empresa',
    'Dirección:',
    'Localidad:',
    'País:',
    'Correo Electrónico:',
    'Notas/Observaciones:',
    'C.P:',
    'Teléfono:',
    'Respuesta',
    '¿Aceptas las condiciones del envío por el precio propuesto?',
    'Rechazar',
    'Aceptar',
];

const LABELS_AND_COLUMNS_REJECT: string[] = [
    'Motivo del rechazo',
    'Por favor, especifique el motivo por el que rechaza la oferta.',
    'Cancelar',
    'Enviar',
];

const LABELS_AND_COLUMNS_REJECTED: string[] = ['Nº REFERENCIA CLIENTE:'];

const LABELS_AND_COLUMNS_REJECTED_EXCLUDED: string[] = [
    'Por favor, especifique el motivo por el que rechaza la oferta.',
    'Introduce tu oferta para llevar este envío',
    'Rechazar',
    'Aceptar',
    'Motivo del rechazo',
    'Por favor, especifique el motivo por el que rechaza la oferta.',
    'Cancelar',
    'Enviar',
    'Datos del transporte',
    'Conductor',
    'Añadir otro conductor',
    'Conductor',
    'Matricula',
    'Añadir otra matricula',
    'Matricula',
    'Guardar',
];

//en pre fallan hasta que pasen el cambio de dev
const LABELS_AND_COLUMNS_REJECTED_EXCLUDED_2: string[] = [
    'Información de recogida',
    'Fecha de recogida estimada',
    'Precio:',
    'Fecha de respuesta:',
    'Características de la mercancía',
    'Tipo de mercancia:',
    'Paquetería',
    'Nº bulto',
    'Ancho',
    'Alto',
    'Largo',
    'Peso',
    'Registros por página',
    'Datos del remitente',
    'Nombre de la empresa',
    'Dirección:',
    'Localidad:',
    'País:',
    'Correo Electrónico:',
    'Notas/Observaciones:',
    'C.P:',
    'Teléfono:',
    'Respuesta',
];

export async function getOrderId(page: Page, reference: string, isOpenPricing?: boolean): Promise<string> {
    await assertTextInRow(page, reference, isOpenPricing ? ORDER_STATUS.PENDING_PRICING : ORDER_STATUS.PENDING_ACCEPT);
    await clickOnText(page, reference);

    await page.waitForTimeout(TIMEOUT);

    await page.waitForURL((url: any) => url != 'https://delivery.dev.packar.es/app/main/order', {
        waitUntil: 'load',
    });

    const url = page.url();
    let orderId: string = '';
    const match = url.match(/\/order\/(\d+)/);
    if (match) {
        orderId = match[1]; // "1268"
    }

    logger.info(' courierAcceptRejectOfferSteps.spec.ts getOrderId ural and orderId', url, orderId);

    await logout(page);

    return orderId;
}

export async function createOrderAndGoToOfferDetailPage(
    page: Page,
    offerTest: OfferTest,
    testIndex: number
): Promise<string> {
    const reference: string = await createNewOrder(page, offerTest, testIndex);

    await page.waitForTimeout(TIMEOUT);

    const orderId = await getOrderId(page, reference);

    logger.info(`courierAcceptRejectOfferSteps.spec.ts createOrderAndGoToOfferDetailPage orderId: ${orderId}`);

    await page.waitForTimeout(TIMEOUT);

    await goToOfferDetailPage(page, offerTest.courier, orderId);

    return orderId;
}

export async function goToOfferDetailPage(page: Page, courier: User, orderId: string): Promise<void> {
    await loginAfterLogout(page, courier);

    await page.waitForURL(`${baserUrl}/app/main/home`, {
        waitUntil: 'load',
    });

    await page.waitForTimeout(TIMEOUT);

    await page.goto(`${baserUrl}/app/main/offertDetail/${orderId}`);
    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });
    await page.waitForTimeout(TIMEOUT);
}

export async function acceptOffer(page: Page, courierHasFixedPrice?: boolean, setPrice?: string): Promise<void> {
    if (courierHasFixedPrice) {
        await offerDetailPageAssertionsFixedPrice(page);
        await clickOnText(page, 'Aceptar');
    } else {
        await offerDetailPageAssertions(page);
        if (setPrice) await getByIdAndFill(page, 'response', setPrice);
        await clickOnText(page, 'Aceptar');
    }
}

export async function rejectOffer(page: Page, rejectText: string): Promise<void> {
    await clickOnText(page, 'Rechazar');

    await page.waitForTimeout(TIMEOUT);

    await offerDetailPageRejectAssertions(page);

    await page.getByText('Motivo del rechazo').nth(1).fill(rejectText);

    await clickOnText(page, 'Enviar');

    await page.waitForTimeout(TIMEOUT);
}

export async function offerDetailPageAssertions(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.spec.ts offerDetailPageAssertions');
    await assertList(page, LABELS_AND_COLUMNS);
    logger.info(' Finish courierAcceptRejectOfferSteps.spec.ts offerDetailPageAssertions');
}

export async function offerDetailPageAssertionsDriver(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.spec.ts offerDetailPageAssertionsDriver');
    await assertList(page, LABELS_AND_COLUMNS_DRIVER);
    logger.info(' Finish courierAcceptRejectOfferSteps.spec.ts offerDetailPageAssertionsDriver');
}

export async function offerDetailPageAssertionsFixedPrice(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.spec.ts offerDetailPageAssertionsFixedPrice');
    await assertList(page, LABELS_AND_COLUMNS_FIXED_PRICE);
    logger.info(' Finish courierAcceptRejectOfferSteps.spec.ts offerDetailPageAssertionsFixedPrice');
}

export async function offerDetailPageRejectAssertions(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.spec.ts offerDetailPageRejectAssertions');
    await assertList(page, LABELS_AND_COLUMNS_REJECT);
    logger.info(' Finish courierAcceptRejectOfferSteps.spec.ts offerDetailPageRejectAssertions');
}

export async function rejectedOfferDetailPageAssertions(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.spec.ts rejectedOfferDetailPageAssertions');
    await assertList(page, LABELS_AND_COLUMNS_REJECTED);

    await assertListExcluded(page, LABELS_AND_COLUMNS_REJECTED_EXCLUDED);

    if (process.env.ENVIRONMENT === 'dev') await assertListExcluded(page, LABELS_AND_COLUMNS_REJECTED_EXCLUDED_2);
    logger.info(' Finish courierAcceptRejectOfferSteps.spec.ts rejectedOfferDetailPageAssertions');
}
