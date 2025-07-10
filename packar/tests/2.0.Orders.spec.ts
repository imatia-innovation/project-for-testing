import test, { Page } from '@playwright/test';
import { OrderProviderMapper } from '../classes/OrderProviderMapper';
import { DEFAULT_NO_TRADITIONAL_COURIER, DESTINATION_FAVORITE, PICKUP_LOCATION } from '../constants';
import {
    assertOrderDetailPageData,
    createNewOrder,
    fillDatesInputs,
    navigateToCreateNewOrderForm,
    navigateToOrderDetailPage,
    navigateToOrdersPageRoutine,
    ORDERS_IDS,
    selectBox,
    selectCompleteOrder,
    selectEnvelope,
    selectPallet,
} from '../functions/steps/ordersSteps';
import logger from '../functions/utils/logger';
import CreateNewOrderTest from '../interfaces/CreateNewOrderTest';

const ORDER_ID = '140';

const order1: CreateNewOrderTest = {
    title: 'should fill the create new order form with the minimum fields selecting Partial Order',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'partial-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order2: CreateNewOrderTest = {
    title: 'should fill the create new order form with the minimum fields selecting Complete Order',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'complete-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 2, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 3, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 4, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 5, weight: 36 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order3: CreateNewOrderTest = {
    title: 'should fill the create new order form with box, complete order, pallet and envelope',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'box-complete-pallet-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });

        await selectCompleteOrder(page, { boxQty: 2, weight: 2 });

        await selectPallet(page, 'Europalet', { length: 3, width: 3, height: 3, weight: 3 }, 3);

        await selectEnvelope(page, { length: 4, width: 4, height: 4, weight: 4 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order4: CreateNewOrderTest = {
    title: 'should fill the create new order form with box, pallet and envelope, with date for 1-2 days',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'box-pallet-envelope-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        const now = new Date();

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() + 1);

        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 2);

        await fillDatesInputs(page, startDate, endDate, now);

        await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

        await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

        await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order5: CreateNewOrderTest = {
    title: 'should fill the create new order with various pallets',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'pallets-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

        await selectPallet(page, 'Isopalet', { length: 5, width: 20, height: 30, weight: 50 }, 6);

        await selectPallet(page, 'Custom', { length: 5, width: 20, height: 30, weight: 50 }, 9);
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order6: CreateNewOrderTest = {
    title: 'should fill the create new order using dynamic destination with email',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'destination-email-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 15, width: 25, height: 35, weight: 55 });
    },
    destination: {
        name: 'Address Test',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order7: CreateNewOrderTest = {
    title: 'should fill the create new order using dynamic destination with phone number',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'destination-phone-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 11, width: 22, height: 33, weight: 44 });
    },
    destination: {
        name: 'Address Test',

        phone: '643222299',
        phoneSecondary: '643222299',
        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order8: CreateNewOrderTest = {
    title: 'should fill the create new order using dynamic destination with email and select other country',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'other-country-' + new Date().getTime().toString(),
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 200, height: 300, weight: 500 });
    },
    destination: {
        name: 'Address Test',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Portugal',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order9: CreateNewOrderTest = {
    title: 'should create an order without provider',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'no-courier-' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 200, height: 300, weight: 500 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order13: CreateNewOrderTest = {
    title: 'should fill the create new order form with provider Bajo Cotización Stardard',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'open-pricing-' + new Date().getTime().toString(),
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
};

let createOrdersTests: CreateNewOrderTest[] = [
    order1,
    order2,
    order3,
    order4,
    order5,
    order6,
    order7,
    order8,
    order9,
    order13,
];

const providerMapper = new OrderProviderMapper();
//createOrdersTests = providerMapper.createOrders(createOrdersTests); // use this line to create more combinations to create orders

test.afterAll('run clean code', async () => {
    logger.info('2.0.Orders.spec.ts afterAll created orders references: ', { ORDERS_IDS });
});

test('should go to the Orders Section and make assertions', async ({ page }) => {
    await navigateToOrdersPageRoutine(page);
});

test('should go to an order detail page', async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    await navigateToOrderDetailPage(page, ORDER_ID);

    await assertOrderDetailPageData(page);
});

test('should open the create new order form', async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    await navigateToCreateNewOrderForm(page);
});

createOrdersTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        await createNewOrder(page, orderTest, testIndex);
    });
});
