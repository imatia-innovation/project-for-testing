// These orders reaches the rules created in 1.courierRules.spec.ts

import test, { Page } from '@playwright/test';
import {
    checkHeaderRow,
    createNewOrder,
    navigateToOrdersPageRoutine,
    selectBox,
    selectCompleteOrder,
} from '../../functions/steps/ordersSteps';
import { clickOnText } from '../../functions/utils/clickOnText';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';
import { ORDER_STATUS } from '../../constants/orderStatus';
import { DESTINATION_FAVORITE, PICKUP_LOCATION, PICKUP_LOCATION_SECONDARY } from '../../constants';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';

// Pending to assignment
const order1: CreateNewOrderTest = {
    title: 'should create an order without provider length: 99, width: 99, height: 99, weight: 99',
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
    title: 'should create an order without provider length: 100, width: 100, height: 100, weight: 100',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order3: CreateNewOrderTest = {
    title: 'should create an order without provider length: 101, width: 101, height: 101, weight: 101',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 101, width: 101, height: 101, weight: 101 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order4: CreateNewOrderTest = {
    title: 'order with destination name containing AAA and width 10',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 500, width: 10, height: 500, weight: 500 });
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
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
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
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
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
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
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
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
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
    title: 'should create an order with CPO no equal to 32900',
    pickUpLocation: PICKUP_LOCATION_SECONDARY, // Here this is a warehouse created by API with CP 32500
    reference: 'atest' + new Date().getTime().toString(),
    selectPackage: async (page: Page) => {
        await selectBox(page, {
            length: 99,
            width: 99,
            height: 99,
            weight: 99,
        });
        await selectCompleteOrder(page, { boxQty: 50, weight: 50 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order10: CreateNewOrderTest = {
    title: 'should create an order with CPD greater than 15000, weight: 250, length: 99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 222, height: 222, weight: 200 });
        await selectCompleteOrder(page, { boxQty: 50, weight: 50 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE, // Here CPD is 15008
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order11: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa, CPD less than 15000, weight: 250, length: 99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 222, height: 222, weight: 200 });
        await selectCompleteOrder(page, { boxQty: 50, weight: 50 });
    },
    destination: {
        name: 'Address Test aaa123aaa',
        mail: 'user@test.com',
        address: 'Address Test',
        zipCode: '14000',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order12: CreateNewOrderTest = {
    title: 'order with destination name does not contain aaa123aaa, CPD less than 15000, weight: 250, length: 99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 222, height: 222, weight: 200 });
        await selectCompleteOrder(page, { boxQty: 50, weight: 50 });
    },
    destination: {
        name: 'Address Test :D',
        mail: 'user@test.com',
        address: 'Address Test',
        zipCode: '14000',
        population: 'Lugo',
        country: 'Spain',
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
];

let pendingOrdersReferences: string[] = [];

ordersPendingToAssignment.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const reference: string = await createNewOrder(page, orderTest, testIndex);

        pendingOrdersReferences.push(reference);

        await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ASSIGNMENT);
    });
});

test('it should mark all pending tests and assign a provider', async ({ page }) => {
    await navigateToOrdersPageRoutine(page);

    await checkHeaderRow(page);

    await clickOnText(page, 'Asignar'); // if it throws error, means that it does not reaches a rule, so you must create a rule before this test

    test.slow();

    await navigateToOrdersPageRoutine(page);
});
