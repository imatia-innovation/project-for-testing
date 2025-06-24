// Get Order ids
// Login as courier and accept one order
// Login as courier and accept the same order with other price
// Reject order

import test, { Page } from '@playwright/test';
import {
    baserUrl,
    courierFixedPrice,
    courierNOFixedPrice,
    DESTINATION_FAVORITE,
    PICKUP_LOCATION,
} from '../../constants';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { selectBox } from '../../functions/steps/ordersSteps';
import {
    createOrderAndGoToOfferDetailPage,
    offerDetailPageAssertions,
    offerDetailPageAssertionsFixedPrice,
    rejectedOfferDetailPageAssertions,
    rejectOffer,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import OfferTest from '../../interfaces/OfferTest';
import OfferTestResult from '../../interfaces/OfferTestResult';

const order1: OfferTest = {
    title: 'Reject Order with Traditional Courier First Offer without Limit Price',
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
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order2: OfferTest = {
    title: 'Reject Order with Traditional Courier First Offer with Limit Price 99.99',
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
    limitPrice: 99.99,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
    courier: courierNOFixedPrice,
};

const order3: OfferTest = {
    title: 'Reject Order with Traditional Courier Manual Assignment without Limit Price',
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
};

const order4: OfferTest = {
    title: 'Reject Order with Traditional Courier Manual Assignment with Limit Price 99.99',
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
    limitPrice: 99.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierNOFixedPrice,
};

const order5: OfferTest = {
    title: 'Reject Order with Traditional Courier Paco First Offer without Limit Price',
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
    title: 'Reject Order with Traditional Courier Paco First Offer with Limit Price 9.99',
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
    title: 'Reject Order with Traditional Courier Paco Manual Assignment without Limit Price',
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
    title: 'Reject Order with Traditional Courier Paco Manual Assignment with Limit Price 9.99',
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

        orderTest.courierHasFixedPrice
            ? await offerDetailPageAssertionsFixedPrice(page)
            : await offerDetailPageAssertions(page);

        await rejectOffer(page, 'Test reject offer');

        await waitForTimeout(page);

        await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
            waitUntil: 'load',
        });

        await waitForTimeout(page);

        await rejectedOfferDetailPageAssertions(page);

        await waitForTimeout(page);
    });
});
