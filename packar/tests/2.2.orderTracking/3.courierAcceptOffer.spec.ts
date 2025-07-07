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
    acceptOffer,
    createOrderAndGoToOfferDetailPage,
    offerDetailPageAssertionsDriver,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import OfferTest from '../../interfaces/OfferTest';
import OfferTestResult from '../../interfaces/OfferTestResult';

const order1: OfferTest = {
    title: `Accept Order with Traditional Courier No fixed price ${courierNOFixedPrice.providerName} First Offer without Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierNOFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 50, width: 50, height: 50, weight: 50 });
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
    title: `Accept Order with Traditional Courier No fixed price ${courierNOFixedPrice.providerName} First Offer with Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierNOFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 50, width: 50, height: 50, weight: 50 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 79.99,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
    courier: courierNOFixedPrice,
    setPrice: '9.99',
};

const order3: OfferTest = {
    title: `Accept Order with Traditional Courier No fixed price ${courierNOFixedPrice.providerName} Manual Assignment without Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierNOFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 50, width: 50, height: 50, weight: 50 });
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
    title: `Accept Order with Traditional Courier No fixed price ${courierNOFixedPrice.providerName} Manual Assignment with Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierNOFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 50, width: 50, height: 50, weight: 50 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 79.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierNOFixedPrice,
    setPrice: '9.99',
};

const order5: OfferTest = {
    title: `Accept Order with Traditional Courier Fixed price ${courierFixedPrice.providerName} First Offer without Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 500, width: 500, height: 500, weight: 500 });
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
    title: `Accept Order with Traditional Courier Fixed price ${courierFixedPrice.providerName} First Offer with Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 500, width: 500, height: 500, weight: 500 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 79.99,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
};

const order7: OfferTest = {
    title: `Accept Order with Traditional Courier Fixed price ${courierFixedPrice.providerName} Manual Assignment without Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 500, width: 500, height: 500, weight: 500 });
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
    title: `Accept Order with Traditional Courier Fixed price ${courierFixedPrice.providerName} Manual Assignment with Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: courierFixedPrice.providerName,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 500, width: 500, height: 500, weight: 500 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    limitPrice: 79.99,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
};

const createOfferTests: OfferTest[] = [order1, order2, order3, order4, order5, order6, order7, order8];

createOfferTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const { orderId }: OfferTestResult = await createOrderAndGoToOfferDetailPage(page, orderTest, testIndex);

        await acceptOffer(page, orderTest.courierHasFixedPrice, orderTest.setPrice);

        await waitForTimeout(page);

        await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
            waitUntil: 'load',
        });
        await waitForTimeout(page);

        await offerDetailPageAssertionsDriver(page);

        await waitForTimeout(page);
    });
});
