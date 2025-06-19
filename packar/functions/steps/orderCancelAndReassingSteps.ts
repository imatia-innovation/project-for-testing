import { Page } from '@playwright/test';
import { ORDER_STATUS } from '../../constants/orderStatus';
import assertByText from '../utils/assertByText';
import { assertTextInRow } from '../utils/assertTextInRow';
import { clickOnText, clickOnTextLast, clickOnTextNth } from '../utils/clickOnText';
import { getById } from '../utils/getById';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { assertOrderDetailPageData, navigateToOrderDetailPage, navigateToOrdersPageRoutine } from './ordersSteps';
import { baserUrl, TIMEOUT } from '../../constants';
import Provider from '../../interfaces/Provider';
import OfferTestResult from '../../interfaces/OfferTestResult';
import logout from './logout';
import {
    createOrderAndGoToOfferDetailPage,
    acceptOffer,
    getOrderId,
} from './orderTracking/courierAcceptRejectOfferSteps';
import OfferTest from '../../interfaces/OfferTest';
import { changeOfferStatus } from './orderTracking/orderExpeditionTrackingSteps';
import { navigateToMyExpeditionsPage } from './myExpeditionsSteps';

export async function reassignOrder(
    page: Page,
    provider: Provider,
    orderIdRef: OfferTestResult,
    traditionalCourier: boolean = false
): Promise<void> {
    await navigateToOrderDetailPage(page, orderIdRef.orderId);

    await clickOnText(page, 'Reasignar pedido');
    await assertByText(
        page,
        'Al confirmar este cambio, se cancelará el pedido actual y se generará un nuevo pedido con el transportista seleccionado. Si la fecha de recogida original es anterior a hoy, será hoy. Si la fecha de entrega original era anterior a mañana, será mañana.'
    );

    await getById(page, 'courier').click();
    await clickOnText(page, ` ${provider.name} `);

    if (traditionalCourier) {
        await clickOnText(page, 'Tipo de Servicio');
        await clickOnTextLast(page, `${provider.service}`);
    } else {
        await getById(page, 'service_type').click();
        await clickOnText(page, ` ${provider.service} `);
    }

    await clickOnText(page, 'Guardar');

    await page.waitForTimeout(TIMEOUT * 2);
}

export async function reassignOrderSuccessfully(
    page: Page,
    provider: Provider,
    orderIdRef: OfferTestResult,
    orderStatusExpected: string,
    traditionalCourier: boolean = false
): Promise<string> {
    await reassignOrder(page, provider, orderIdRef, traditionalCourier);

    // Expected result:
    await waitUntilUrlLoads(page, '/app/main/order');
    await page.waitForTimeout(TIMEOUT);
    await assertTextInRow(page, orderIdRef.reference, orderStatusExpected);

    const newOrderId = await getOrderId(page, orderIdRef.reference);
    return newOrderId;
}

export async function createOrderWithAssignedStatus(page: Page, order: OfferTest, index: number) {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order, index);

    await acceptOfferAndLogout(page, orderId, order.courierHasFixedPrice, order.setPrice);

    await navigateToOrdersPageRoutine(page);
    await assertTextInRow(page, reference, ORDER_STATUS.ASSIGNED);

    return { orderId, reference } as OfferTestResult;
}

export async function acceptOfferAndLogout(
    page: Page,
    orderId: string,
    courierHasFixedPrice?: boolean,
    setPrice?: string
) {
    await acceptOffer(page, courierHasFixedPrice, setPrice);

    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });
    await page.waitForTimeout(TIMEOUT);

    await logout(page);
    await page.waitForTimeout(TIMEOUT);
}

export async function cancelOrder(page: Page, orderId: string): Promise<void> {
    await navigateToOrderDetailPage(page, orderId);

    await clickOnText(page, 'Cancelar envío');
    await assertByText(page, 'Al confirmar este cambio, se cancelará el pedido actual.');

    await clickOnTextNth(page, 'Cancelar', 4);
    await page.waitForTimeout(TIMEOUT * 2);
}

export async function cancelOrderSuccessfully(page: Page, orderId: string): Promise<void> {
    await cancelOrder(page, orderId);

    // Expected result:
    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page);
    await assertByText(page, ORDER_STATUS.CANCELLED);
}

export async function changeOfferStatusAndLogout(
    page: Page,
    orderIdRef: OfferTestResult,
    status: string,
    makeLogout: boolean = true
) {
    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderIdRef.orderId}`, {
        waitUntil: 'load',
    });

    await navigateToMyExpeditionsPage(page);
    await page.waitForTimeout(TIMEOUT * 2);

    await clickOnText(page, orderIdRef.reference);
    await page.waitForTimeout(TIMEOUT * 2);

    await clickOnText(page, 'Destino');
    await page.waitForTimeout(TIMEOUT);

    await changeOfferStatus(page, status);

    await page.waitForTimeout(TIMEOUT);

    if (makeLogout) {
        await logout(page);
        await page.waitForTimeout(TIMEOUT);
    }
}
