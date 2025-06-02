import test, { Page } from '@playwright/test';
import {
    assertTextInRow,
    assertTextIsNotInRow,
    checkHeaderRow,
    createNewOrder,
    navigateToOrdersPageRoutine,
    ORDERS_IDS,
    selectBox,
    selectCompleteOrder,
} from '../functions/steps/ordersSteps';
import { clickOnButton } from '../functions/utils/clickOnText';
import CreateNewOrderTest from '../interfaces/CreateNewOrderTest';
import logger from '../functions/utils/logger';

// Pending to assignment
const order1: CreateNewOrderTest = {
    title: 'should create an order without provider length: 99, width: 99, height: 99, weight: 99',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 99, width: 99, height: 99, weight: 99 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order2: CreateNewOrderTest = {
    title: 'should create an order without provider length: 100, width: 100, height: 100, weight: 100',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order3: CreateNewOrderTest = {
    title: 'should create an order without provider length: 101, width: 101, height: 101, weight: 101',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 101, width: 101, height: 101, weight: 101 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order4: CreateNewOrderTest = {
    title: 'order with destination name containing AAA',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 500, width: 500, height: 500, weight: 500 });
    },
    destination: {
        name: 'Address Test AAA',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order5: CreateNewOrderTest = {
    title: 'order with destination name containing bbbAAAccc',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 499, width: 499, height: 499, weight: 499 });
    },
    destination: {
        name: 'Address Test bbbAAAccc',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order6: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa and boxQty: 50, weight: 50',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 50, weight: 50 });
    },
    destination: {
        name: 'Address Test aaa123aaa',
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
    title: 'order with destination name containing aaa123aaa and boxQty: 51, weight: 51',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 51, weight: 51 });
    },
    destination: {
        name: 'Address Test aaa123aaa',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order8: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa and boxQty: 49, weight: 49',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 49, weight: 49 });
    },
    destination: {
        name: 'Address Test aaa123aaa',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order9: CreateNewOrderTest = {
    title: 'should create an order without provider length: 1, width: 1, height: 1, weight: 1',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order10: CreateNewOrderTest = {
    title: 'should create an order without provider length: 2, width: 2, height: 2, weight: 2',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 2, width: 2, height: 2, weight: 2 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order11: CreateNewOrderTest = {
    title: 'should create an order without provider length: 3, width: 3, height: 3, weight: 3',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 3, width: 3, height: 3, weight: 3 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order12: CreateNewOrderTest = {
    title: 'should create an order without provider length: 4, width: 4, height: 4, weight: 4',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 4, width: 4, height: 4, weight: 4 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order13: CreateNewOrderTest = {
    title: 'should create an order without provider length: 5, width: 5, height: 5, weight: 5',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 5, width: 5, height: 5, weight: 5 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order14: CreateNewOrderTest = {
    title: 'should create an order without provider length: 6, width: 6, height: 6, weight: 6',
    pickUpLocation: 'Renlo',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 6, width: 6, height: 6, weight: 6 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const ordersPendingToAssignment = [
    order1,
    order2,
    order3,
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
    order14,
];

test.afterAll('run clean code', async () => {
    logger.info('ordersPendingAssignment.spec.ts.ts afterAll created orders references: ', { ORDERS_IDS });
});

let pendingOrdersReferences: string[] = [];

ordersPendingToAssignment.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const reference: string = await createNewOrder(page, orderTest, testIndex);

        pendingOrdersReferences.push(reference);

        await assertTextInRow(page, reference, 'PENDING ASSIGNMENT');
    });
});

test.skip('it should mark all pending tests and assign a provider', async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    await checkHeaderRow(page);

    await clickOnButton(page, 'sendAsignar'); // if it throws error, means that it does not reaches a rule, so you must create a rule before this test

    test.slow();

    await navigateToOrdersPageRoutine(page);

    for (let index = 0; index < pendingOrdersReferences.length; index++) {
        const reference = pendingOrdersReferences[index];
        await assertTextIsNotInRow(page, reference, 'PENDING ASSIGNMENT');
    }
});
