// These orders reaches the rules created in 1.courierRules.spec.ts

import test, { Page } from '@playwright/test';
import { DESTINATION_FAVORITE, PICKUP_LOCATION, PICKUP_LOCATION_SECONDARY, TEST_NEW_SHIPPER } from '../../constants';
import { ORDER_STATUS } from '../../constants/orderStatus';
import {
    checkHeaderRow,
    createNewOrder,
    navigateToOrdersPageRoutine,
    selectBox,
    selectCompleteOrder,
} from '../../functions/steps/ordersSteps';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';
import { clickOnText } from '../../functions/utils/clickOnText';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';

// Pending to assignment
const order1: CreateNewOrderTest = {
    title: 'should create an order height: 100',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'height100-' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 99, height: 100, weight: 99 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order2: CreateNewOrderTest = {
    title: 'should create an order width: 10',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'width10-' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 10, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order3: CreateNewOrderTest = {
    title: 'should create an order length: 101',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'length101-' + new Date().getTime().toString(),

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
    title: 'order with weight: 50',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'weight50-' + new Date().getTime().toString(),

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

const order5: CreateNewOrderTest = {
    title: 'order with weight: 51',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'weight51-' + new Date().getTime().toString(),

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

const order6: CreateNewOrderTest = {
    title: 'should create an order with CPO no equal to 32900',
    pickUpLocation: PICKUP_LOCATION_SECONDARY, // Here this is a warehouse created by API with CP 32500
    reference: 'atest-' + 'CPO32500-' + new Date().getTime().toString(),
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
const order7: CreateNewOrderTest = {
    title: 'should create an order with CPD greater than 15000, weight: 250, length: 99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'CPD15008-' + new Date().getTime().toString(),
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

const order8: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'name-aaa123aaa-' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 100, weight: 100 });
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
    title: 'order with destination name containing AAA and width 500',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'name-AAA-' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
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

const order10: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa, CPD less than 15000, weight: 200, length: 99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'weight200-length99-' + new Date().getTime().toString(),
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

const order11: CreateNewOrderTest = {
    title: 'order with CPD less than 15000, weight: 250, length: 99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'weight250-length99-' + new Date().getTime().toString(),
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 222, height: 200, weight: 250 });
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

const ordersPendingToAssignment = TEST_NEW_SHIPPER
    ? [order1, order2, order3, order4, order5, order6, order7, order8, order10, order11]
    : [order1, order2, order3, order4, order5, order6, order7, order8, order9, order10, order11];

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
    await waitForTimeout(page);

    await navigateToOrdersPageRoutine(page);
});
