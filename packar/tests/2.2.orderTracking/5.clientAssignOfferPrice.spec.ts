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
import { gotToOrderDetailPage, orderDetailPageAssertions, selectBox } from '../../functions/steps/ordersSteps';
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
    title: 'Accept Order with: Open Price, No Fixed Price Courier, First Offer; without: Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
    title: 'Accept Order with: Open Price, No Fixed Price Courier, Manual Assignment; without: Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
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

const order3: OfferOpenPriceTest = {
    title: 'Accept Order with: Open Price, No Fixed Price Courier, First Offer, Limit Price 9.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
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
    limitPrice: 9.99,
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
    title: 'Accept Order with: Open Price, No Fixed Price Courier, Manual Assignment, Limit Price 9.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
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
    limitPrice: 9.99,
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
    title: 'Accept Order with: Open Price, Fixed Price Courier, First Offer; without: Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    provider,
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
            courier: courierOther, // if is not setPrice, then reject offer
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
            setPrice: '1',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order6: OfferOpenPriceTest = {
    title: 'Accept Order with: Open Price, Fixed Price Courier, Manual Assignment; without: Limit Price',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
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
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
            setPrice: '1',
        },
        // {
        //     courier: courierFixedPrice, // on PRE can't do this provider test
        //     courierHasFixedPrice: false, // it doesn't matter be false here because always it'll be false for Open Price
        //     setPrice: '75.99',
        // },
    ],
    assignButtonIndex: 1,
};

const order7: OfferOpenPriceTest = {
    title: 'Accept Order with: Open Price, Fixed Price Courier, First Offer, Limit Price 9.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
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
    limitPrice: 9.99,
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
            setPrice: '1',
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order8: OfferOpenPriceTest = {
    title: 'Accept Order with: Open Price, Fixed Price Courier, Manual Assignment, Limit Price 9.99',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
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
    limitPrice: 9.99,
    couriersTest: [
        {
            courier: courierOther, // if is not setPrice, then reject offer
        },
        {
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
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

        await gotToOrderDetailPage(page, admin, orderId); // assertions on detail page then assign a price

        await waitForTimeout(page);

        logger.info('5.clientAssignOfferPrice.spec.ts orderTest.assignmentMethod: ', orderTest.assignmentMethod);

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

            await waitForTimeout(page);
        }

        await orderDetailPageAssertions(page, orderTest, ORDER_STATUS.ASSIGNED);
    });
});
