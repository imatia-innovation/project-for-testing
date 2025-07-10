// create Orders with Traditional Courier
// Manual Assignment
// First Offer

import test, { Page } from '@playwright/test';
import { courierNOFixedPrice, DESTINATION_FAVORITE, PICKUP_LOCATION } from '../../constants';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { ORDER_STATUS } from '../../constants/orderStatus';
import { createNewOrder, selectBox } from '../../functions/steps/ordersSteps';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';

const provider: string = courierNOFixedPrice.providerName!;

const order1: CreateNewOrderTest = {
    title: 'create Order with Traditional Courier First Offer without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'tradic-primera-oferta-' + new Date().getTime().toString(),
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

const order2: CreateNewOrderTest = {
    title: 'create Order with Traditional Courier First Offer with Limit Price 99.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'tradic-primera-oferta-limit99' + new Date().getTime().toString(),
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
    limitPrice: 99.99,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order3: CreateNewOrderTest = {
    title: 'create Order with Traditional Courier Manual Assignment without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'tradic-manual-' + +new Date().getTime().toString(),
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
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const order4: CreateNewOrderTest = {
    title: 'create Order with Traditional Courier Manual Assignment with Limit Price 59.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest-' + 'tradic-manual-limit59' + new Date().getTime().toString(),
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
    limitPrice: 59.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const createOrdersTests: CreateNewOrderTest[] = [order1, order2, order3, order4];

createOrdersTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const reference: string = await createNewOrder(page, orderTest, testIndex);
        await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ACCEPT);
    });
});
