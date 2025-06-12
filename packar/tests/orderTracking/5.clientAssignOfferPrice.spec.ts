// Create Open Price Orders
// Get Order ids
// Login as courier and accept one order
// Login as courier and accept the same order with other price
// Login as courier and reject the same order
// Accept the better price with client

import test, { Locator, Page } from '@playwright/test';
import { gotToOrderDetailPage, orderDetailPageAssertions, selectBox } from '../../functions/steps/ordersSteps';
import { PROVIDER_SERVICES } from '../../constants/providers';
import { courierNOFixedPrice, PICKUP_LOCATION, DESTINATION_FAVORITE, courier, admin, TIMEOUT } from '../../constants';
import {
    acceptOffer,
    goToOfferDetailPage,
    rejectOffer,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import OfferOpenPriceTest from '../../interfaces/OfferOpenPriceTest';
import { createOrderOpenPricingAndGetOrderId } from '../../functions/steps/orderTracking/clientAssignOfferPriceSteps';

import { ORDER_STATUS } from '../../constants/orderStatus';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { clickOnButton, clickOnTextNth, locateTheButtonIndex } from '../../functions/utils/clickOnText';
import logout from '../../functions/steps/logout';
import logger from '../../functions/utils/logger';
import { locateRow } from '../../functions/utils/assertTextInRow';
import { getEnabledButtonExcludingText, getEnabledButtonsByText } from '../../functions/utils/getEnabledButton';

const order1: OfferOpenPriceTest = {
    title: 'Accept Order with Open Price Courier First Offer without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[7].name,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 10, width: 10, height: 10, weight: 10 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    couriersTest: [
        {
            courier: courier, // if is not setPrice, then reject offer
        },
        {
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '95.99',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order2: OfferOpenPriceTest = {
    title: 'Accept Order with Open Price Courier Manual Assignment without Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider: PROVIDER_SERVICES[7].name,
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
    couriersTest: [
        {
            courier: courier, // if is not setPrice, then reject offer
        },
        {
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '88.75',
        },
        // {
        //     courier: courierFixedPrice, // on PRE can't do this provider test
        //     courierHasFixedPrice: false, // it doesn't matter be false here because always it'll be false for Open Price
        //     setPrice: '75.99',
        // },
    ],
    assignButtonIndex: 1,
};

const createOfferTests: OfferOpenPriceTest[] = [order1, order2];

createOfferTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const orderId = await createOrderOpenPricingAndGetOrderId(page, orderTest, testIndex, true);

        await page.waitForTimeout(TIMEOUT);

        test.slow();

        for (let i = 0; i < orderTest.couriersTest.length; i++) {
            const courierElement = orderTest.couriersTest[i];

            await goToOfferDetailPage(page, courierElement.courier, orderId);

            if (courierElement.setPrice) {
                await acceptOffer(page, courierElement.courierHasFixedPrice, courierElement.setPrice);
            } else {
                await rejectOffer(page, 'Test reject offer open price');
            }

            await page.waitForTimeout(TIMEOUT);

            await logout(page);

            await page.waitForTimeout(TIMEOUT);
        }

        await gotToOrderDetailPage(page, admin, orderId); // assertions on detail page then assign a price

        await page.waitForTimeout(TIMEOUT);

        logger.info('5.clientAssignOfferPrice.spec.ts orderTest.assignmentMethod: ', orderTest.assignmentMethod);

        if (orderTest.assignmentMethod === ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT) {
            // should accept Open Price

            await orderDetailPageAssertions(page, orderTest, ORDER_STATUS.PENDING_PRICING);

            await page.waitForTimeout(TIMEOUT);

            logger.info(
                "Start 5.clientAssignOfferPrice.spec.ts searching enabled button with text: 'local_shipping Asignar '"
            );

            const assignButtonLocators: Locator[] = await getEnabledButtonsByText(page, 'local_shipping Asignar ');
            const assignButtonLocator = await getEnabledButtonExcludingText(assignButtonLocators, 'Reasignar pedido');
            await assignButtonLocator?.click();

            logger.info(
                "Finish 5.clientAssignOfferPrice.spec.ts searching enabled button with text: 'local_shipping Asignar '"
            );

            await page.waitForTimeout(5000);
        }

        await orderDetailPageAssertions(page, orderTest, ORDER_STATUS.ASSIGNED);
    });
});
