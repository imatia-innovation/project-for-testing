// Get Order id
// Login as courier and accept one order
// Login as courier and accept the same order with other price
// Reject order

import { Page } from '@playwright/test';
import { baserUrl } from '../../../constants';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import OfferTest from '../../../interfaces/OfferTest';
import OfferTestResult from '../../../interfaces/OfferTestResult';
import User from '../../../interfaces/User';
import assertList from '../../utils/assertList';
import assertListExcluded from '../../utils/assertListExcluded';
import { assertTextInRow } from '../../utils/assertTextInRow';
import { clickOnText } from '../../utils/clickOnText';
import { getByIdAndFill } from '../../utils/getByIdAndFill';
import logger from '../../utils/logger';
import { waitForTimeout } from '../../utils/waitforTimeout';
import { loginAfterLogout } from '../login';
import logout from '../logout';
import { createNewOrder } from '../ordersSteps';

const LABELS_AND_COLUMNS: string[] = [
    'Nº REFERENCIA CLIENTE',
    'Información de recogida',
    'Fecha de recogida estimada',
    'Precio',
    'Fecha de respuesta',
    'Características de la mercancía',
    'Tipo de mercancia',
    'Paquetería',
    'Nº bulto',
    'Ancho',
    'Alto',
    'Largo',
    'Peso',
    'Registros por página',
    'Datos del remitente',
    'Nombre de la empresa',
    'Dirección',
    'Localidad',
    'País',
    'Correo Electrónico',
    'Notas/Observaciones',
    'C.P',
    'Teléfono',
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
    'Nº REFERENCIA CLIENTE',
    'Información de recogida',
    'Fecha de recogida estimada',
    'Precio',
    'Fecha de respuesta',
    'Características de la mercancía',
    'Tipo de mercancia',
    'Paquetería',
    'Nº bulto',
    'Ancho',
    'Alto',
    'Largo',
    'Peso',
    'Registros por página',
    'Datos del remitente',
    'Nombre de la empresa',
    'Dirección',
    'Localidad',
    'País',
    'Correo Electrónico',
    'Notas/Observaciones',
    'C.P',
    'Teléfono',
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

const LABELS_AND_COLUMNS_REJECTED: string[] = ['Nº REFERENCIA CLIENTE'];

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
    'Precio',
    'Fecha de respuesta',
    'Características de la mercancía',
    'Tipo de mercancia',
    'Paquetería',
    'Nº bulto',
    'Ancho',
    'Alto',
    'Largo',
    'Peso',
    'Registros por página',
    'Datos del remitente',
    'Nombre de la empresa',
    'Dirección',
    'Localidad',
    'País',
    'Correo Electrónico',
    'Notas/Observaciones',
    'C.P',
    'Teléfono',
    'Respuesta',
];

export async function getOrderId(page: Page, reference: string): Promise<string> {
    await clickOnText(page, reference);

    await waitForTimeout(page);

    await page.waitForURL((url: any) => url != baserUrl + '/app/main/order', {
        waitUntil: 'load',
    });

    const url = page.url();
    let orderId: string = '';
    const match = url.match(/\/order\/(\d+)/);
    if (match) {
        orderId = match[1]; // 1268
    }

    logger.info(' courierAcceptRejectOfferSteps.ts getOrderId url and orderId', url, orderId);
    return orderId;
}

export async function createOrderAndGoToOfferDetailPage(
    page: Page,
    offerTest: OfferTest,
    testIndex: number
): Promise<OfferTestResult> {
    const reference: string = await createNewOrder(page, offerTest, testIndex);
    await waitForTimeout(page);

    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ACCEPT);
    const orderId = await getOrderId(page, reference);

    await logout(page);

    logger.info(`courierAcceptRejectOfferSteps.ts createOrderAndGoToOfferDetailPage orderId: ${orderId}`);

    await waitForTimeout(page);

    await goToOfferDetailPage(page, offerTest.courier, orderId);

    return {
        orderId,
        reference,
    };
}

export async function goToOfferDetailPage(page: Page, courier: User, orderId: string): Promise<void> {
    await loginAfterLogout(page, courier);

    await page.waitForURL(`${baserUrl}/app/main/home`, {
        waitUntil: 'load',
    });

    await waitForTimeout(page);

    await page.goto(`${baserUrl}/app/main/offertDetail/${orderId}`);
    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });
    await waitForTimeout(page);
}

export async function acceptOffer(page: Page, courierHasFixedPrice?: boolean, setPrice?: string): Promise<void> {
    if (courierHasFixedPrice) {
        await offerDetailPageAssertionsFixedPrice(page);
        await clickOnText(page, 'Aceptar');
    } else {
        await offerDetailPageAssertions(page);
        if (setPrice) {
            await getByIdAndFill(page, 'response', setPrice);
        }
        await clickOnText(page, 'Aceptar');
    }
}

export async function rejectOffer(page: Page, rejectText: string): Promise<void> {
    await clickOnText(page, 'Rechazar');

    await waitForTimeout(page);

    await offerDetailPageRejectAssertions(page);

    await page.getByText('Motivo del rechazo').nth(1).fill(rejectText);

    await clickOnText(page, 'Enviar');

    await waitForTimeout(page);
}

export async function rejectOfferAndLogout(page: Page, orderId: string) {
    await rejectOffer(page, 'Test reject offer');
    await waitForTimeout(page);

    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });
    await waitForTimeout(page);

    await rejectedOfferDetailPageAssertions(page);
    await waitForTimeout(page);

    await logout(page);
    await waitForTimeout(page);
}

export async function offerDetailPageAssertions(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.ts offerDetailPageAssertions');
    await assertList(page, LABELS_AND_COLUMNS);
    logger.info(' Finish courierAcceptRejectOfferSteps.ts offerDetailPageAssertions');
}

export async function offerDetailPageAssertionsDriver(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.ts offerDetailPageAssertionsDriver');
    await assertList(page, LABELS_AND_COLUMNS_DRIVER);
    logger.info(' Finish courierAcceptRejectOfferSteps.ts offerDetailPageAssertionsDriver');
}

export async function offerDetailPageAssertionsFixedPrice(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.ts offerDetailPageAssertionsFixedPrice');
    await assertList(page, LABELS_AND_COLUMNS_FIXED_PRICE);
    logger.info(' Finish courierAcceptRejectOfferSteps.ts offerDetailPageAssertionsFixedPrice');
}

export async function offerDetailPageRejectAssertions(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.ts offerDetailPageRejectAssertions');
    await assertList(page, LABELS_AND_COLUMNS_REJECT);
    logger.info(' Finish courierAcceptRejectOfferSteps.ts offerDetailPageRejectAssertions');
}

export async function rejectedOfferDetailPageAssertions(page: Page): Promise<void> {
    logger.info(' Start courierAcceptRejectOfferSteps.ts rejectedOfferDetailPageAssertions');
    await assertList(page, LABELS_AND_COLUMNS_REJECTED);

    await assertListExcluded(page, LABELS_AND_COLUMNS_REJECTED_EXCLUDED);

    if (process.env.ENVIRONMENT === 'dev') await assertListExcluded(page, LABELS_AND_COLUMNS_REJECTED_EXCLUDED_2);
    logger.info(' Finish courierAcceptRejectOfferSteps.ts rejectedOfferDetailPageAssertions');
}
