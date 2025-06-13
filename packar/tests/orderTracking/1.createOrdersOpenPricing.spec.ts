// create Orders with Open Pricing Provider

import test, { Page } from '@playwright/test';
import { createNewOrder, selectBox } from '../../functions/steps/ordersSteps';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { PROVIDER_SERVICES } from '../../constants/providers';
import { ORDER_STATUS } from '../../constants/orderStatus';
import { DESTINATION_FAVORITE, PICKUP_LOCATION } from '../../constants';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';
import { PRE_PROVIDER_SERVICES } from '../../constants/pre-providers';

const PROV_SERVICES = process.env.ENVIRONMENT === 'pre' ? PRE_PROVIDER_SERVICES : PROVIDER_SERVICES;

const provider: string = 'BAJO COTIZACIÓN';

const order1: CreateNewOrderTest = {
    title: 'create Order with Open Pricing Courier First Offer without Limit Price',
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

const order2: CreateNewOrderTest = {
    title: 'create Order with Open Pricing Courier First Offer with Limit Price 99.99',
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
    limitPrice: 99.99,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order3: CreateNewOrderTest = {
    title: 'create Order with Open Pricing Courier Manual Assignment without Limit Price',
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
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const order4: CreateNewOrderTest = {
    title: 'create Order with Open Pricing Courier Manual Assignment with Limit Price 59.99',
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
    limitPrice: 59.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const createOrdersTests: CreateNewOrderTest[] = [order1, order2, order3, order4];

createOrdersTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const reference: string = await createNewOrder(page, orderTest, testIndex);
        await assertTextInRow(page, reference, ORDER_STATUS.PENDING_PRICING);
    });
});
