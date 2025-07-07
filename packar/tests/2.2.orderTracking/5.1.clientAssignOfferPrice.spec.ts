// Create Open Price Orders
// Get Order ids
// Login as courier and accept one order
// Login as courier and accept the same order with other price
// Login as courier and reject the same order
// Accept the better price with client

import test, { Locator, Page } from '@playwright/test';
import {
    admin,
    courierFixedPrice,
    courierNOFixedPrice,
    courierOther,
    DESTINATION_FAVORITE,
    PICKUP_LOCATION,
} from '../../constants';
import { goToOrderDetailPage, orderDetailPageAssertions, selectBox } from '../../functions/steps/ordersSteps';
import { createOrderOpenPricingAndGetOrderId } from '../../functions/steps/orderTracking/clientAssignOfferPriceSteps';
import {
    acceptOffer,
    goToOfferDetailPage,
    rejectOffer,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import OfferOpenPriceTest from '../../interfaces/OfferOpenPriceTest';

import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { ORDER_STATUS } from '../../constants/orderStatus';
import logout from '../../functions/steps/logout';
import { getEnabledButtonExcludingText, getEnabledButtonsByText } from '../../functions/utils/getEnabledButton';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';

const provider = 'BAJO COTIZACIÓN';

const order1: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, First Offer; without: Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 50, width: 50, height: 50, weight: 50 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
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
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, Manual Assignment; without: Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
        },
        {
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '88.75',
        },
    ],
    assignButtonIndex: 1,
};

const order3: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, First Offer, Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
        },
        {
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '9',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order4: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, Manual Assignment, Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
        },
        {
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '9',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const order5: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, First Offer; without: Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
    service: 0,
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 500, width: 500, height: 500, weight: 500 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    couriersTest: [
        {
            courier: courierOther,
            courierHasFixedPrice: true,
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '1',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order6: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, Manual Assignment; without: Limit Price`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
            courierHasFixedPrice: true,
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '1',
        },
    ],
    assignButtonIndex: 1,
};

const order7: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, First Offer, Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
            courierHasFixedPrice: true,
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '1',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order8: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, Manual Assignment, Limit Price 79.99`,
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
            courierHasFixedPrice: true,
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '1',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const createOfferTests: OfferOpenPriceTest[] = [order1, order2, order3, order4, order5, order6, order7, order8];

createOfferTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const orderId = await createOrderOpenPricingAndGetOrderId(page, orderTest, testIndex, true);

        await waitForTimeout(page);

        test.slow();

        for (let i = 0; i < orderTest.couriersTest.length; i++) {
            const courierElement = orderTest.couriersTest[i];

            await goToOfferDetailPage(page, courierElement.courier, orderId);

            if (courierElement.setPrice) {
                await acceptOffer(page, courierElement.courierHasFixedPrice, courierElement.setPrice);
            } else {
                await rejectOffer(page, 'Test reject offer open price');
            }

            await waitForTimeout(page);

            await logout(page);

            await waitForTimeout(page);
        }

        await goToOrderDetailPage(page, admin, orderId); // assertions on detail page then assign a price

        await waitForTimeout(page, 4);

        logger.info('5.clientAssignOfferPrice.spec.ts orderTest.assignmentMethod: ', orderTest.assignmentMethod);
        test.slow();
        test.slow();

        if (orderTest.assignmentMethod === ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT) {
            // should accept Open Price

            await orderDetailPageAssertions(page, orderTest, ORDER_STATUS.PENDING_PRICING);

            await waitForTimeout(page);

            logger.info(
                "Start 5.clientAssignOfferPrice.spec.ts searching enabled button with text: 'local_shipping Asignar '"
            );

            const assignButtonLocators: Locator[] = await getEnabledButtonsByText(page, 'local_shipping Asignar ');
            const assignButtonLocator = await getEnabledButtonExcludingText(assignButtonLocators, 'Reasignar pedido');
            await assignButtonLocator?.click();

            logger.info(
                "Finish 5.clientAssignOfferPrice.spec.ts searching enabled button with text: 'local_shipping Asignar '"
            );

            await waitForTimeout(page, 4);
        }

        await orderDetailPageAssertions(page, orderTest, ORDER_STATUS.ASSIGNED);
    });
});
