import test, { Page } from '@playwright/test';
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
import CreateNewOrderTest from '../interfaces/CreateNewOrderTest';
import logger from '../functions/utils/logger';
import { OrderProviderMapper } from '../classes/OrderProviderMapper';

const ORDER_ID = '140';

const order1: CreateNewOrderTest = {
    title: 'should fill the create new order form with the minimum fields selecting Partial Order',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'GLS',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order2: CreateNewOrderTest = {
    title: 'should fill the create new order form with the minimum fields selecting Complete Order',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'NARVAL',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 2, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 3, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 4, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 5, weight: 36 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order3: CreateNewOrderTest = {
    title: 'should fill the create new order form with box, complete order, pallet and envelope',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'SEUR',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

        await selectCompleteOrder(page, { boxQty: 50, weight: 50 });

        await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

        await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order4: CreateNewOrderTest = {
    title: 'should fill the create new order form with box, pallet and envelope, with date for 1-2 days',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'STEF',
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
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order5: CreateNewOrderTest = {
    title: 'should fill the create new order with various pallets',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'CORREOS',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

        await selectPallet(page, 'Isopalet', { length: 5, width: 20, height: 30, weight: 50 }, 6);

        await selectPallet(page, 'Custom', { length: 5, width: 20, height: 30, weight: 50 }, 9);
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order6: CreateNewOrderTest = {
    title: 'should fill the create new order using dynamic destination with email',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'GLS',
    service: 1,
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
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'NARVAL',
    service: 1,
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
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'SEUR',
    service: 1,
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
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 200, height: 300, weight: 500 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order10: CreateNewOrderTest = {
    title: 'should fill the create new order form with provider Paco Stardard',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'TRANSPORTES PACO',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order11: CreateNewOrderTest = {
    title: 'should fill the create new order form with provider Emilio Stardard',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'EMILIO SL',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order12: CreateNewOrderTest = {
    title: 'should fill the create new order form with provider STEF Congelado',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'STEF',
    service: 1,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order13: CreateNewOrderTest = {
    title: 'should fill the create new order form with provider Bajo Cotización Stardard',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'BAJO COTIZACIÓN',
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

let createOrdersTests: CreateNewOrderTest[] = [
    order1,
    order2,
    order3, // va a fallar hasta que corrijan el bug
    order4,
    order5,
    order6,
    order7,
    order8,
    order9,
    order10,
    order11,
    order12,
    order13,
];

const providerMapper = new OrderProviderMapper();
createOrdersTests = providerMapper.createOrders(createOrdersTests);

test.afterAll('run clean code', async () => {
    logger.info('orders.spec.ts.ts afterAll created orders references: ', { ORDERS_IDS });
});

test(`should go to the Orders Section and make assertions`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page);
});

test(`should go to an order detail page`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    await navigateToOrderDetailPage(page, ORDER_ID);

    await assertOrderDetailPageData(page);
});

test(`should open the create new order form`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    await navigateToCreateNewOrderForm(page);
});

createOrdersTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        await createNewOrder(page, orderTest, testIndex);
    });
});
