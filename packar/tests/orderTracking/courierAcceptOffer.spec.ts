// Get Order ids
// Login as courier and accept one order
// Login as courier and accept the same order with other price
// Reject order

import test, { Page } from '@playwright/test';
import { selectBox } from '../../functions/steps/ordersSteps';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { PROVIDER_SERVICES } from '../../constants/providers';
import { clickOnText } from '../../functions/utils/clickOnText';
import {
    baserUrl,
    courierNOFixedPrice,
    courierFixedPrice,
    pickUpLocation,
    destination_favorite,
} from '../../constants';
import {
    createOrderAndGoToOfferDetailPage,
    offerDetailPageAssertions,
    offerDetailPageAssertionsDriver,
    offerDetailPageAssertionsFixedPrice,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps.spec';
import { getByIdAndFill } from '../../functions/utils/getByIdAndFill';
import OfferTest from '../../interfaces/OfferTest';

const TIMEOUT = process.env.ENVIRONMENT === 'dev' ? 800 : 1000;

const order1: OfferTest = {
    title: 'Accept Order with Traditional Courier First Offer without Limit Price',
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[6].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    courier: courierNOFixedPrice,
    setPrice: '10',
};

const order2: OfferTest = {
    title: 'Accept Order with Traditional Courier First Offer with Limit Price 9.99',
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[6].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
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
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[6].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierNOFixedPrice,
    setPrice: '10',
};

const order4: OfferTest = {
    title: 'Accept Order with Traditional Courier Manual Assignment with Limit Price 9.99',
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[6].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
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
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[5].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
};

const order6: OfferTest = {
    title: 'Accept Order with Traditional Courier Paco First Offer with Limit Price 9.99',
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[5].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
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
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[5].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
    courier: courierFixedPrice,
    courierHasFixedPrice: true,
};

const order8: OfferTest = {
    title: 'Accept Order with Traditional Courier Paco Manual Assignment with Limit Price 9.99',
    pickUpLocation,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[5].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
    },
    destination: {
        favorite: destination_favorite,
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
        const orderId = await createOrderAndGoToOfferDetailPage(page, orderTest, testIndex);

        if (orderTest.courierHasFixedPrice) {
            await offerDetailPageAssertionsFixedPrice(page);
            await clickOnText(page, 'Aceptar');
        } else {
            await offerDetailPageAssertions(page);

            if (orderTest.setPrice) await getByIdAndFill(page, 'response', orderTest.setPrice);

            await clickOnText(page, 'Aceptar');
        }

        await page.waitForTimeout(TIMEOUT);

        await page.waitForURL(`${baserUrl}/app/main/offertDetail/${orderId}`, {
            waitUntil: 'load',
        });
        await page.waitForTimeout(TIMEOUT);

        await offerDetailPageAssertionsDriver(page);

        await page.waitForTimeout(TIMEOUT);
    });
});
