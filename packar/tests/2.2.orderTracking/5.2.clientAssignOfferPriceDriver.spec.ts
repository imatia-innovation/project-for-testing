// Create order with ASSIGNED status
// Accept Order
// Select a Driver

import test, { Locator, Page } from '@playwright/test';
import {
    admin,
    courierFixedPrice,
    courierFixedPriceDrivers,
    courierNOFixedPrice,
    courierNOFixedPriceDrivers,
    DESTINATION_FAVORITE,
    PICKUP_LOCATION,
} from '../../constants';
import { goToOrderDetailPage, orderDetailPageAssertions, selectBox } from '../../functions/steps/ordersSteps';
import { createOrderOpenPricingAndGetOrderId } from '../../functions/steps/orderTracking/clientAssignOfferPriceSteps';
import {
    acceptOffer,
    goToOfferDetailPage,
    offerDetailPageAssertionsDriver,
    rejectOffer,
    selectExistingDriverAndSave,
    writeNewDriverAndSave,
} from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';

import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { ORDER_STATUS } from '../../constants/orderStatus';
import logout from '../../functions/steps/logout';
import { getEnabledButtonExcludingText, getEnabledButtonsByText } from '../../functions/utils/getEnabledButton';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import OfferOpenPriceTest from '../../interfaces/OfferOpenPriceTest';

const provider = 'BAJO COTIZACIÓN';

const order1: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, First Offer; without: Limit Price. And select existing Driver.`,
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
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '95.99',
            driver: {
                driverName: courierNOFixedPriceDrivers.driverNames[0],
                vehicleRegister: courierNOFixedPriceDrivers.vehicleRegisters[0],
            },
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order2: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, Manual Assignment; without: Limit Price. And select existing Driver.`,
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
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '88.75',
            driver: {
                driverName: courierNOFixedPriceDrivers.driverNames[1],
                vehicleRegister: courierNOFixedPriceDrivers.vehicleRegisters[1],
            },
        },
    ],
    assignButtonIndex: 1,
};

const order3: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, First Offer, Limit Price 79.99. And select existing Driver.`,
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
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '9',
            driver: {
                driverName: courierNOFixedPriceDrivers.driverNames[0],
                vehicleRegister: courierNOFixedPriceDrivers.vehicleRegisters[0],
            },
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order4: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierNOFixedPrice ${courierNOFixedPrice.providerName}, Manual Assignment, Limit Price 79.99. And select existing Driver.`,
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
            courier: courierNOFixedPrice,
            courierHasFixedPrice: false,
            setPrice: '9',
            driver: {
                driverName: courierNOFixedPriceDrivers.driverNames[0],
                vehicleRegister: courierNOFixedPriceDrivers.vehicleRegisters[0],
            },
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const order5: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, First Offer; without: Limit Price. And select existing Driver.`,
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
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
            setPrice: '1',
            driver: {
                driverName: courierFixedPriceDrivers.driverNames[0],
                vehicleRegister: courierFixedPriceDrivers.vehicleRegisters[0],
            },
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order6: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, Manual Assignment; without: Limit Price. And select existing Driver.`,
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
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
            setPrice: '1',
            driver: {
                driverName: courierFixedPriceDrivers.driverNames[0],
                vehicleRegister: courierFixedPriceDrivers.vehicleRegisters[0],
            },
        },
    ],
    assignButtonIndex: 1,
};

const order7: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, First Offer, Limit Price 79.99. And select existing Driver.`,
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
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
            setPrice: '1',
            driver: {
                driverName: courierFixedPriceDrivers.driverNames[0],
                vehicleRegister: courierFixedPriceDrivers.vehicleRegisters[0],
            },
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
};

const order8: OfferOpenPriceTest = {
    title: `Accept Order with: Open Price, courierFixedPrice ${courierFixedPrice.providerName}, Manual Assignment, Limit Price 79.99. And select existing Driver.`,
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
            courier: courierFixedPrice,
            courierHasFixedPrice: false, // for the assert message
            setPrice: '1',
            driver: {
                driverName: courierFixedPriceDrivers.driverNames[0],
                vehicleRegister: courierFixedPriceDrivers.vehicleRegisters[0],
            },
        },
    ],
    assignButtonIndex: 1,
    assignmentMethod: ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT,
};

const createOfferTests: OfferOpenPriceTest[] = [order1, order2, order3, order4, order5, order6, order7, order8];

createOfferTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        let alreadySavedDriver: boolean = false;
        const orderId = await createOrderOpenPricingAndGetOrderId(page, orderTest, testIndex, true);

        await waitForTimeout(page);

        test.slow();

        for (let i = 0; i < orderTest.couriersTest.length; i++) {
            const courierElement = orderTest.couriersTest[i];

            await goToOfferDetailPage(page, courierElement.courier, orderId);

            if (courierElement.setPrice) {
                await acceptOffer(page, courierElement.courierHasFixedPrice, courierElement.setPrice);

                await waitForTimeout(page, 3);
                //
                if (orderTest.assignmentMethod === ASSIGNMENT_METHOD.FIRST_OFFER) {
                    await offerDetailPageAssertionsDriver(page);

                    if (orderTest.createNewDriver) {
                        await writeNewDriverAndSave(page, courierElement.driver!);
                    } else {
                        await selectExistingDriverAndSave(page, courierElement.courier, courierElement.driver!);
                    }
                    alreadySavedDriver = true;
                }
                //
            } else {
                await rejectOffer(page, 'Test reject offer open price');
            }

            await waitForTimeout(page);

            await logout(page);

            await waitForTimeout(page);
        }

        await goToOrderDetailPage(page, admin, orderId); // assertions on detail page then assign a price

        await waitForTimeout(page, 3);

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
        await logout(page);

        test.slow();
        test.slow();

        const courierToSetDiver = orderTest.couriersTest.find((courier) => courier.setPrice);
        if (courierToSetDiver && !alreadySavedDriver) {
            await goToOfferDetailPage(page, courierToSetDiver.courier, orderId);

            await offerDetailPageAssertionsDriver(page);

            if (orderTest.createNewDriver && !alreadySavedDriver) {
                await writeNewDriverAndSave(page, courierToSetDiver.driver!);
            } else {
                await selectExistingDriverAndSave(page, courierToSetDiver.courier, courierToSetDiver.driver!);
            }
        }
    });
});
