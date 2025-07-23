import test, { Page } from '@playwright/test';
import {
    courierFixedPrice,
    courierNOFixedPrice,
    DEFAULT_NO_TRADITIONAL_COURIER,
    DESTINATION_FAVORITE,
    PICKUP_LOCATION,
    TEST_NEW_SHIPPER,
} from '../../constants';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { ORDER_STATUS } from '../../constants/orderStatus';
import logout from '../../functions/steps/logout';
import {
    assertOrderDetailPageData,
    createNewOrder,
    navigateToOrderDetailPage,
    navigateToOrdersPageRoutine,
    selectBox,
} from '../../functions/steps/ordersSteps';
import { getOrderId, goToOfferDetailPage } from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';
import OfferTest from '../../interfaces/OfferTest';
import OfferTestResult from '../../interfaces/OfferTestResult';

import {
    acceptOfferAndLogout,
    cancelOrderSuccessfully,
    createOrderWithAssignedStatus,
    reassignOrderSuccessfully,
} from '../../functions/steps/orderCancelAndReassignSteps';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
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

test("should go to an order with status 'Pte. asignación' detail page and try to reassign", async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order1, 0);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ASSIGNMENT);

    const orderId = await getOrderId(page, reference);
    const provider: Provider = {
        name: DEFAULT_NO_TRADITIONAL_COURIER.provider,
        service: DEFAULT_NO_TRADITIONAL_COURIER.service,
    };
    const orderIdRef: OfferTestResult = { orderId, reference };
    test.slow();

    const orderStatusExpected = ORDER_STATUS.ASSIGNED;
    const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);
    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});

test("should go to an order with status 'Pte. cotización' detail page and try to reassign", async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order4, 1);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_PRICING);

    const orderId = await getOrderId(page, reference);

    const provider: Provider = {
        name: DEFAULT_NO_TRADITIONAL_COURIER.provider,
        service: DEFAULT_NO_TRADITIONAL_COURIER.service,
    };
    const orderIdRef: OfferTestResult = { orderId, reference };
    test.slow();

    const orderStatusExpected = ORDER_STATUS.ASSIGNED;
    const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);
    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});

test("should go to an order with status 'Pte. aceptación' detail page and reassign to other courier", async ({
    page,
}) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order2, 2);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ACCEPT);

    const orderId = await getOrderId(page, reference);
    const provider: Provider = {
        name: DEFAULT_NO_TRADITIONAL_COURIER.provider,
        service: DEFAULT_NO_TRADITIONAL_COURIER.service,
    };
    const orderIdRef: OfferTestResult = { orderId, reference };
    const orderStatusExpected = ORDER_STATUS.ASSIGNED;
    test.slow();
    const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});

test("should go to an order with status 'Pte. aceptación' detail page, reassign to other courier, and try to cancel the order", async ({
    page,
}) => {
    await navigateToOrdersPageRoutine(page);

    const reference: string = await createNewOrder(page, order2, 3);
    await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ACCEPT);

    const orderId = await getOrderId(page, reference);
    const provider: Provider = {
        name: DEFAULT_NO_TRADITIONAL_COURIER.provider,
        service: DEFAULT_NO_TRADITIONAL_COURIER.service,
    };
    const orderIdRef: OfferTestResult = { orderId, reference };
    const orderStatusExpected = ORDER_STATUS.ASSIGNED;
    test.slow();
    const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);

    // try to cancel but there is a bug
    await cancelOrderSuccessfully(page, orderId2);
});

test("should go to an order with status 'Asignado' detail page and reassign to other courier", async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderWithAssignedStatus(page, order3, 4);

    test.slow();

    const provider: Provider = {
        name: DEFAULT_NO_TRADITIONAL_COURIER.provider,
        service: DEFAULT_NO_TRADITIONAL_COURIER.service,
    };
    const orderIdRef: OfferTestResult = { orderId, reference };
    const orderStatusExpected = ORDER_STATUS.ASSIGNED;
    const orderId2: string = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected);

    await navigateToOrderDetailPage(page, orderId);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});

test('should reassign an order by second time', async ({ page }) => {
    const { orderId, reference }: OfferTestResult = await createOrderWithAssignedStatus(page, order3, 5);

    test.slow();

    let orderId2 = orderId;

    if (!TEST_NEW_SHIPPER) {
        const provider: Provider = { name: courierFixedPrice.providerName!, service: 'Estándar' };

        const orderIdRef: OfferTestResult = { orderId, reference };
        const orderStatusExpected = ORDER_STATUS.PENDING_ACCEPT;
        orderId2 = await reassignOrderSuccessfully(page, provider, orderIdRef, orderStatusExpected, true);

        await navigateToOrderDetailPage(page, orderId);
        await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

        await navigateToOrderDetailPage(page, orderId2);
        await assertOrderDetailPageData(page, ORDER_STATUS.PENDING_ACCEPT);

        await logout(page);
        await waitForTimeout(page);

        await goToOfferDetailPage(page, courierFixedPrice, orderId2);
        await acceptOfferAndLogout(page, orderId2, true, order3.setPrice);
        test.slow();
    }

    await navigateToOrdersPageRoutine(page);
    await assertTextInRow(page, reference, ORDER_STATUS.ASSIGNED);

    await navigateToOrderDetailPage(page, orderId2);

    const provider2: Provider = {
        name: DEFAULT_NO_TRADITIONAL_COURIER.provider,
        service: DEFAULT_NO_TRADITIONAL_COURIER.service,
    };
    const orderIdRef2: OfferTestResult = { orderId: orderId2, reference };
    const orderId3 = await reassignOrderSuccessfully(page, provider2, orderIdRef2, ORDER_STATUS.ASSIGNED);

    await navigateToOrderDetailPage(page, orderId2);
    await assertOrderDetailPageData(page, ORDER_STATUS.CANCELLED);

    await navigateToOrderDetailPage(page, orderId3);
    await assertOrderDetailPageData(page, ORDER_STATUS.ASSIGNED);
});
