import test, { Locator, Page } from '@playwright/test';
import { ORDER_STATUS } from '../../constants/orderStatus';
import {
    navigateToOrdersPageRoutine,
    createNewOrder,
    navigateToOrderDetailPage,
    assertOrderDetailPageData,
    selectBox,
} from '../../functions/steps/ordersSteps';
import {
    acceptOffer,
    createOrderAndGoToOfferDetailPage,
    getOrderId,
    goToOfferDetailPage,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import assertByText from '../../functions/utils/assertByText';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';
import { clickOnText, clickOnTextNth } from '../../functions/utils/clickOnText';
import {
    courierNOFixedPrice,
    PICKUP_LOCATION,
    DESTINATION_FAVORITE,
    TIMEOUT,
    baserUrl,
    PROVIDER_SERVICES,
    courierFixedPrice,
} from '../../constants';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';
import OfferTest from '../../interfaces/OfferTest';
import OfferTestResult from '../../interfaces/OfferTestResult';
import logout from '../../functions/steps/logout';
import { navigateToMyExpeditionsPage } from '../../functions/steps/myExpeditionsSteps';
import {
    confirmDeliveryModalAssertions,
    saveIncidence,
    selectOrderAndStatus,
} from '../../functions/steps/orderTracking/orderExpeditionTrackingSteps';
import assertListExcluded from '../../functions/utils/assertListExcluded';
import logger from '../../functions/utils/logger';
import {
    acceptOfferAndLogout,
    createOrderWithAssignedStatus,
    reassignOrder,
    reassignOrderSuccessfully,
} from '../../functions/steps/orderCancelAndReassingSteps';
import Provider from '../../interfaces/Provider';

const provider: string = courierNOFixedPrice.providerName!;

const order1: CreateNewOrderTest = {
    title: 'should create an order without provider',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 99, height: 99, weight: 99 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order2: CreateNewOrderTest = {
    title: 'create Order with Traditional Courier First Offer without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order3: OfferTest = {
    title: 'Accept Order with Traditional Courier First Offer without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierNOFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    courier: courierNOFixedPrice,
    setPrice: '10',
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order4: CreateNewOrderTest = {
    title: 'create Order with Open Pricing Courier Manual Assignment with Limit Price 59.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: 'BAJO COTIZACIÓN',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 59.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

test("should go to an order with status 'Pte. asignación' detail page and try to reassign but throws an error", async ({
    page,
}) => {
    // BUG
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order1, 0);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ASSIGNMENT);

    const orderId = await getOrderId(page, reference);
    const provider: Provider = { name: 'GLS', service: 'Estándar 24H' };
    const orderIdRef: OfferTestResult = { orderId, reference };
    test.slow();

    // IT SHOULD BE THIS:
    // const orderStatusExpected = ORDER_STATUS.ASSIGNED
    // const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);
    // await navigateToOrderDetailPage(page, orderId);
    // await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    // await navigateToOrderDetailPage(page, orderId2);
    // await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);

    // CURRENTLY IS THIS:
    await reassignOrder(page, provider, orderIdRef);
    await assertByText(page, `No se puede reasignar el envío ${reference} porque está asignado a una expedición.`);

    await clickOnTextNth(page, 'Ok', 0);
    await clickOnTextNth(page, 'Cancelar', 2);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page);
    await assertByText(page, ORDER_STATUS.PENDING_ASSIGNMENT);
});

test("should go to an order with status 'Pte. cotización' detail page and try to reassign but throws an error", async ({
    page,
}) => {
    // BUG
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order4, 1);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_PRICING);

    const orderId = await getOrderId(page, reference);

    const provider: Provider = { name: 'GLS', service: 'Estándar 24H' };
    const orderIdRef: OfferTestResult = { orderId, reference };
    test.slow();

    // IT SHOULD BE THIS:
    // const orderStatusExpected = ORDER_STATUS.ASSIGNED
    // const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);
    // await navigateToOrderDetailPage(page, orderId);
    // await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    // await navigateToOrderDetailPage(page, orderId2);
    // await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);

    // CURRENTLY IS THIS:
    await reassignOrder(page, provider, orderIdRef);
    await assertByText(page, `No se puede reasignar el envío ${reference} porque está asignado a una expedición.`);

    await clickOnTextNth(page, 'Ok', 0);
    await clickOnTextNth(page, 'Cancelar', 2);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page);
    await assertByText(page, ORDER_STATUS.PENDING_PRICING);
});

test("should go to an order with status 'Pte. aceptación' detail page and reassign to other courier", async ({
    page,
}) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order2, 2);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ACCEPT);

    const orderId = await getOrderId(page, reference);
    const provider: Provider = { name: 'GLS', service: 'Estándar 24H' };
    const orderIdRef: OfferTestResult = { orderId, reference };
    const orderStatusExpected = ORDER_STATUS.ASSIGNED;
    test.slow();
    const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});

test("should go to an order with status 'Asignado' detail page and reassign to other courier", async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderWithAssignedStatus(page, order3, 3);

    test.slow();

    const provider: Provider = { name: 'GLS', service: 'Estándar 24H' };
    const orderIdRef: OfferTestResult = { orderId, reference };
    const orderStatusExpected = ORDER_STATUS.ASSIGNED;
    const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});

test("should go to an order with status 'Recogido' detail page and it can not be reassigned", async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 4);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await page.waitForTimeout(TIMEOUT);

    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });

    await navigateToMyExpeditionsPage(page);
    await page.waitForTimeout(TIMEOUT * 2);

    await clickOnText(page, reference);
    await page.waitForTimeout(TIMEOUT * 2);

    const orderIndex: number = 0; // first order
    const statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);

    await page.waitForTimeout(TIMEOUT);
    await logout(page);
    await page.waitForTimeout(TIMEOUT);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.RECEIVED);

    await navigateToOrderDetailPage(page, orderId);

    await page.waitForTimeout(TIMEOUT);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Reasignar pedido']);
});

test("should go to an order with status 'En ruta' detail page and it can not be reassigned", async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 5);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await page.waitForTimeout(TIMEOUT);

    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });

    await navigateToMyExpeditionsPage(page);
    await page.waitForTimeout(TIMEOUT * 2);

    await clickOnText(page, reference);
    await page.waitForTimeout(TIMEOUT * 2);

    const orderIndex: number = 0; // first order
    let statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);

    await page.waitForTimeout(TIMEOUT);

    statusIndex = 2; // on route
    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.ON_ROUTE);

    await page.waitForTimeout(TIMEOUT);

    await logout(page);
    await page.waitForTimeout(TIMEOUT);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.ON_ROUTE);

    await navigateToOrderDetailPage(page, orderId);

    await page.waitForTimeout(TIMEOUT);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Reasignar pedido']);
});

test("should go to an order with status 'Entregado' detail page and it can not be reassigned", async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 6);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await page.waitForTimeout(TIMEOUT);

    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });

    await navigateToMyExpeditionsPage(page);
    await page.waitForTimeout(TIMEOUT * 2);

    await clickOnText(page, reference);
    await page.waitForTimeout(TIMEOUT * 2);

    const orderIndex: number = 0; // first order
    let statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);

    await page.waitForTimeout(TIMEOUT);

    statusIndex = 2; // on route
    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.ON_ROUTE);

    await page.waitForTimeout(TIMEOUT);

    const confirmDeliveryTextLocator: Locator = page.getByText('Confirmar entrega');
    const confirmDeliveryBtnLocators: Locator[] = await confirmDeliveryTextLocator.all();
    logger.info('2.orderReassign.spec.ts Incidence buttons number: ', confirmDeliveryBtnLocators.length);

    await confirmDeliveryBtnLocators[orderIndex].click();
    await confirmDeliveryModalAssertions(page);

    await page.getByText('DNI').nth(0).fill('03915150K');
    await clickOnText(page, 'Guardar');

    await page.waitForTimeout(TIMEOUT);

    await assertByText(page, ORDER_STATUS.SENT);

    await logout(page);
    await page.waitForTimeout(TIMEOUT);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.SENT);

    await navigateToOrderDetailPage(page, orderId);

    await page.waitForTimeout(TIMEOUT);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Reasignar pedido']);
});

test("should go to an order with status 'Incidencia' detail page and it can not be reassigned", async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 7);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await page.waitForTimeout(TIMEOUT);

    await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
        waitUntil: 'load',
    });

    await navigateToMyExpeditionsPage(page);
    await page.waitForTimeout(TIMEOUT * 2);

    await clickOnText(page, reference);
    await page.waitForTimeout(TIMEOUT * 2);

    const orderIndex: number = 0; // first order
    const statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);

    await page.waitForTimeout(TIMEOUT);

    await saveIncidence(page, 0, 'Esto es un test automatizado');
    await page.waitForTimeout(TIMEOUT);

    await logout(page);
    await page.waitForTimeout(TIMEOUT);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.INCIDENCE);

    await navigateToOrderDetailPage(page, orderId);

    await page.waitForTimeout(TIMEOUT);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Reasignar pedido']);
});

test('should reassign an order by second time', async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderWithAssignedStatus(page, order3, 8);

    test.slow();

    const provider: Provider = { name: courierFixedPrice.providerName!, service: 'Standard' };
    const orderIdRef: OfferTestResult = { orderId, reference };
    const orderStatusExpected = ORDER_STATUS.PENDING_ACCEPT;
    const orderId2 = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected, true);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.PENDING_ACCEPT);

    await logout(page);
    await page.waitForTimeout(TIMEOUT);

    await goToOfferDetailPage(page, courierFixedPrice, orderId2);
    await acceptOfferAndLogout(page, orderId2, true, order3.setPrice);

    test.slow();

    await navigateToOrdersPageRoutine(page);
    await assertTextInRow(page, reference, ORDER_STATUS.ASSIGNED);

    await navigateToOrderDetailPage(page, orderId2);

    const provider2: Provider = { name: 'GLS', service: 'Estándar 24H' };
    const orderIdRef2: OfferTestResult = { orderId: orderId2, reference };
    const orderId3 = await reassignOrderSuccessfully(page, provider2, orderIdRef2, ORDER_STATUS.ASSIGNED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId3);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});
