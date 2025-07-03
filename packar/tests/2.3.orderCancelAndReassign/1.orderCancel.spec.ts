import test, { Page } from '@playwright/test';
import { DESTINATION_FAVORITE, PICKUP_LOCATION, courierNOFixedPrice } from '../../constants';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { ORDER_STATUS } from '../../constants/orderStatus';
import logout from '../../functions/steps/logout';
import {
    cancelOrderSuccessfully,
    changeOfferStatusAndLogout,
    createOrderWithAssignedStatus,
} from '../../functions/steps/orderCancelAndReassingSteps';
import {
    assertOrderDetailPageData,
    createNewOrder,
    navigateToOrderDetailPage,
    navigateToOrdersPageRoutine,
    selectBox,
} from '../../functions/steps/ordersSteps';
import {
    acceptOffer,
    createOrderAndGoToOfferDetailPage,
    getOrderId,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import { saveIncidence } from '../../functions/steps/orderTracking/orderExpeditionTrackingSteps';
import assertListExcluded from '../../functions/utils/assertListExcluded';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';
import OfferTest from '../../interfaces/OfferTest';
import OfferTestResult from '../../interfaces/OfferTestResult';

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
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
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
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
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
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 59.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

test("should go to an order with status 'Pte. asignación' detail page and try to cancel", async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order1, 0);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ASSIGNMENT);

    const orderId = await getOrderId(page, reference);

    test.slow();

    await cancelOrderSuccessfully(page, orderId);
});

test("should go to an order with status 'Pte. cotización' detail page and try to cancel", async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order4, 1);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_PRICING);

    const orderId = await getOrderId(page, reference);

    test.slow();

    await cancelOrderSuccessfully(page, orderId);
});

test("should go to an order with status 'Pte. aceptación' detail page and cancel", async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order2, 2);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ACCEPT);

    const orderId = await getOrderId(page, reference);

    test.slow();
    await cancelOrderSuccessfully(page, orderId);
});

test("should go to an order with status 'Asignado' detail page and cancel", async ({ page }) => {
    const { orderId }: OfferTestResult = await createOrderWithAssignedStatus(page, order3, 3);

    test.slow();
    await cancelOrderSuccessfully(page, orderId);
});

test("should go to an order with status 'Recogido' detail page and it can not be cancelled or reassigned neither", async ({
    page,
}) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 4);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await waitForTimeout(page);

    await changeOfferStatusAndLogout(page, { orderId, reference }, ORDER_STATUS.RECEIVED);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.RECEIVED);

    await navigateToOrderDetailPage(page, orderId);

    await waitForTimeout(page);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Cancelar envío']);
});

test("should go to an order with status 'En ruta' detail page and it can not be cancelled or reassigned neither", async ({
    page,
}) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 5);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await waitForTimeout(page);

    await changeOfferStatusAndLogout(page, { orderId, reference }, ORDER_STATUS.ON_ROUTE);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.ON_ROUTE);

    await navigateToOrderDetailPage(page, orderId);

    await waitForTimeout(page);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Cancelar envío']);
});

test("should go to an order with status 'Entregado' detail page and it can not be cancelled or reassigned neither", async ({
    page,
}) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 6);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await waitForTimeout(page);

    await changeOfferStatusAndLogout(page, { orderId, reference }, ORDER_STATUS.SENT);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.SENT);

    await navigateToOrderDetailPage(page, orderId);

    await waitForTimeout(page);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Cancelar envío']);
});

test("should go to an order with status 'Incidencia' detail page and it can not be cancelled or reassigned neither", async ({
    page,
}) => {
    const { orderId, reference }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, order3, 7);

    await acceptOffer(page, order3.courierHasFixedPrice, order3.setPrice);
    await waitForTimeout(page);

    await changeOfferStatusAndLogout(page, { orderId, reference }, ORDER_STATUS.RECEIVED, false);

    await saveIncidence(page, 0, 'Esto es un test automatizado');
    await waitForTimeout(page);

    await logout(page);
    await waitForTimeout(page);

    test.slow();

    await navigateToOrdersPageRoutine(page);

    await assertTextInRow(page, reference, ORDER_STATUS.INCIDENCE);

    await navigateToOrderDetailPage(page, orderId);

    await waitForTimeout(page);
    await assertOrderDetailPageData(page);

    await assertListExcluded(page, ['Cancelar envío', 'Reasignar pedido']);
});

test("should go to an order with status 'Cancelado' detail page and it can not be cancelled", async ({ page }) => {
    const { orderId }: OfferTestResult = await createOrderWithAssignedStatus(page, order3, 8);

    test.slow();

    await cancelOrderSuccessfully(page, orderId);

    await assertListExcluded(page, ['Cancelar envío']);
});
