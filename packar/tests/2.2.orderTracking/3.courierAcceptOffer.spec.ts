// Get Order ids
// Login as courier and accept one order
// Login as courier and accept the same order with other price
// Reject order

import test, { Page } from '@playwright/test';
import { selectBox } from '../../functions/steps/ordersSteps';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import {
    baserUrl,
    courierNOFixedPrice,
    courierFixedPrice,
    PICKUP_LOCATION,
    DESTINATION_FAVORITE,
    TIMEOUT,
} from '../../constants';
import {
    acceptOffer,
    createOrderAndGoToOfferDetailPage,
    offerDetailPageAssertionsDriver,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import OfferTest from '../../interfaces/OfferTest';
import OfferTestResult from '../../interfaces/OfferTestResult';

const order1: OfferTest = {
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

const order2: OfferTest = {
    title: 'Accept Order with Traditional Courier First Offer with Limit Price 9.99',
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
    limitPrice: 9.99,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
    courier: courierNOFixedPrice,
    setPrice: '9.99',
};

const order3: OfferTest = {
    title: 'Accept Order with Traditional Courier Manual Assignment without Limit Price',
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
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierNOFixedPrice,
    setPrice: '10',
};

const order4: OfferTest = {
    title: 'Accept Order with Traditional Courier Manual Assignment with Limit Price 9.99',
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
    limitPrice: 9.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierNOFixedPrice,
    setPrice: '9.99',
};

const order5: OfferTest = {
    title: 'Accept Order with Traditional Courier Paco First Offer without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order6: OfferTest = {
    title: 'Accept Order with Traditional Courier Paco First Offer with Limit Price 9.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 9.99,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
};

const order7: OfferTest = {
    title: 'Accept Order with Traditional Courier Paco Manual Assignment without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
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
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
};

const order8: OfferTest = {
    title: 'Accept Order with Traditional Courier Paco Manual Assignment with Limit Price 9.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 9.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
};

const createOfferTests: OfferTest[] = [order1, order2, order3, order4, order5, order6, order7, order8];

createOfferTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const { orderId }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, orderTest, testIndex);

        await acceptOffer(page, orderTest.courierHasFixedPrice, orderTest.setPrice);

        await page.waitForTimeout(TIMEOUT);

        await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
            waitUntil: 'load',
        });
        await page.waitForTimeout(TIMEOUT);

        await offerDetailPageAssertionsDriver(page);

        await page.waitForTimeout(TIMEOUT);
    });
});
