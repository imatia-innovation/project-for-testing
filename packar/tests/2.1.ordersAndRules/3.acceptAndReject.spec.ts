import test, { Page } from '@playwright/test';
import {
    courierFixedPrice,
    courierNOFixedPrice,
    courierOther,
    DEFAULT_NO_TRADITIONAL_COURIER,
    DESTINATION_FAVORITE,
    PICKUP_LOCATION,
    TEST_NEW_SHIPPER,
} from '../../constants';
import { ORDER_STATUS } from '../../constants/orderStatus';
import { OPERATOR_OPTIONS, PROPERTY_OPTIONS } from '../../constants/rulesPropertiesAndOperations';
import logout from '../../functions/steps/logout';
import {
    acceptOrReject,
    assertValuesInRow,
    checkOrderAndAssignCourier,
    createNewOrder,
    goToOrderDetailPageAndAssignOfferPrice,
    navigateToOrdersPageRoutine,
    selectBox,
} from '../../functions/steps/ordersSteps';
import { getOrderId } from '../../functions/steps/orderTracking/courierAcceptRejectOfferSteps';
import { createRule, deleteRules, navigateToRulesPageRoutine } from '../../functions/steps/rulesSteps';
import { assertTextInRow } from '../../functions/utils/assertTextInRow';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';
import AccRejAssignByRulesTest, { CourierResponseOffer } from '../../interfaces/AccRejAssignByRulesTest';
import CreateNewRuleOrderTest from '../../interfaces/CreateNewRuleOrderTest';

const rule1: CreateNewRuleOrderTest = {
    testTitle: `Si el alto es igual que 100, asignar a ${courierNOFixedPrice.providerName!}`,
    provider: courierNOFixedPrice.providerName!,
    service: 0,
    priority: '1',
    conditions: [
        {
            property: PROPERTY_OPTIONS[0], // Alto
            operation: OPERATOR_OPTIONS[2], // igual que
            value: '100',
        },
    ],
};

const rule2: CreateNewRuleOrderTest = {
    testTitle: `Si el alto es menor que 100, asignar a ${courierFixedPrice.providerName!}`,
    provider: courierFixedPrice.providerName!,
    service: 0,
    priority: '2',
    conditions: [
        {
            property: PROPERTY_OPTIONS[0], // Alto
            operation: OPERATOR_OPTIONS[6], // menor que
            value: '100',
        },
    ],
};

const rule3: CreateNewRuleOrderTest = {
    testTitle: 'Si el alto es mayor que 100, asignar a BAJO COTIZACIÓN',
    provider: 'BAJO COTIZACIÓN',
    service: 0,
    priority: '3',
    conditions: [
        {
            property: PROPERTY_OPTIONS[0], // Alto
            operation: OPERATOR_OPTIONS[4], // mayor que
            value: '100',
        },
    ],
};

const rule4: CreateNewRuleOrderTest = {
    // Genera incidencia en el pedido
    testTitle: `Si el ancho es igual que 98, asignar a ${courierOther.providerName!}`,
    provider: courierOther.providerName!,
    service: 0,
    priority: '4',
    conditions: [
        {
            property: PROPERTY_OPTIONS[1], // Ancho
            operation: OPERATOR_OPTIONS[2], // igual que
            value: '98',
        },
    ],
};

const rule5: CreateNewRuleOrderTest = {
    // Generates incidence
    testTitle: 'Si el ancho menor que 100, asignar a STEF',
    provider: DEFAULT_NO_TRADITIONAL_COURIER.provider,
    service: 0,
    priority: '5',
    conditions: [
        {
            property: PROPERTY_OPTIONS[1], // Ancho
            operation: OPERATOR_OPTIONS[6], // menor que
            value: '100',
        },
    ],
};

let newRuleTests: CreateNewRuleOrderTest[] =
    process.env.ENVIRONMENT === 'pre' ? [rule1, rule2, rule3, rule4] : [rule1, rule2, rule3, rule4, rule5];

test('Delete rules again ', async ({ page }) => {
    await deleteRules(page);
});

newRuleTests.forEach((rule, index) => {
    test(`Create rule${index + 1} "${rule.testTitle}" `, async ({ page }) => {
        await navigateToRulesPageRoutine(page);

        test.slow();

        await createRule(page, rule);
    });
});

const order1: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule1 to Accept',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule1,
    couriersResponses: [
        {
            courier: courierNOFixedPrice,
            sendResponse: 'ACCEPT',
            hasFixedPrice: false,
            setPrice: '19.15',
            expectedRowValues: {
                expectedStatus: ORDER_STATUS.ASSIGNED,
                courier: rule1.provider,
            },
        },
    ],
};

const order2: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule1 to Reject',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule1,
    couriersResponses: [
        {
            courier: courierNOFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
            setPrice: '19.15',
            expectedRowValues: {
                expectedStatus: ORDER_STATUS.REJECTED,
            },
        },
    ],
};

const order3: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule2 to Accept',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 99, height: 99, weight: 99 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule2,
    couriersResponses: [
        {
            courier: courierFixedPrice,
            sendResponse: 'ACCEPT',
            hasFixedPrice: !TEST_NEW_SHIPPER,
            setPrice: '33.55',
            expectedRowValues: {
                expectedStatus: ORDER_STATUS.ASSIGNED,
                courier: rule2.provider,
            },
        },
    ],
};

const order4: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule2 to Reject, and ends with INCIDENCE or ASSIGNED status for STEF courier',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 99, width: 97, height: 99, weight: 99 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule2,
    couriersResponses: [
        {
            courier: courierFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
            setPrice: '33.55',
            expectedRowValues: {
                //expectedStatus: ORDER_STATUS.INCIDENCE,
                courier: DEFAULT_NO_TRADITIONAL_COURIER.provider,
            },
        },
    ],
};

let order5: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule3 to Accept and Reject Bajo Cotización',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 21, width: 21, height: 101, weight: 21 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule3,
    couriersResponses: [
        {
            courier: courierFixedPrice,
            sendResponse: 'ACCEPT',
            hasFixedPrice: false,
            setPrice: '19.15',
        },
        {
            courier: courierNOFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
        },
    ],
    expectedRowValues: {
        expectedStatus: ORDER_STATUS.ASSIGNED,
        courier: courierFixedPrice.providerName!,
    },
};

let order6: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule3 to Reject with all providers Bajo Cotización',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),
    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 101, width: 101, height: 101, weight: 101 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule3,
    couriersResponses: [
        {
            courier: courierFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
        },
        {
            courier: courierNOFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
        },
        {
            courier: courierOther,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
        },
    ],
    expectedRowValues: {
        expectedStatus: ORDER_STATUS.REJECTED,
    },
};

let order7: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule1 to Reject, jumps to rule4, and ends with INCIDENCE or ASSIGNED status for STEF couriers',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 98, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule1,
    couriersResponses: [
        {
            courier: courierNOFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: true,
            expectedRowValues: {
                expectedStatus: ORDER_STATUS.PENDING_ACCEPT,
                courier: rule4.provider,
            },
        },
        {
            courier: courierOther,
            sendResponse: 'REJECT',
            hasFixedPrice: true,
            expectedRowValues: {
                //expectedStatus: ORDER_STATUS.INCIDENCE,
                courier: DEFAULT_NO_TRADITIONAL_COURIER.provider,
            },
        },
    ],
};

let order8: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule1 to Reject, jumps to rule4 and ends with ASSIGNED status',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 98, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule1,
    couriersResponses: [
        {
            courier: courierNOFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
            setPrice: '15.15',
            expectedRowValues: {
                expectedStatus: ORDER_STATUS.PENDING_ACCEPT,
                courier: rule4.provider,
            },
        },
        {
            courier: courierOther,
            sendResponse: 'ACCEPT',
            hasFixedPrice: false,
            setPrice: '15.15',
            expectedRowValues: {
                expectedStatus: ORDER_STATUS.ASSIGNED,
                courier: rule4.provider,
            },
        },
    ],
};

let order9: AccRejAssignByRulesTest = {
    title: 'should create an order that reaches rule1 to Reject, jumps to rule4 to Reject, jumps to rule 5 and ends with INCIDENCE or ASSIGNED status',
    pickUpLocation: PICKUP_LOCATION,
    reference: 'atest' + new Date().getTime().toString(),

    selectPackage: async (page: Page) => {
        await selectBox(page, { length: 100, width: 98, height: 100, weight: 100 });
    },
    destination: {
        favorite: DESTINATION_FAVORITE,
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
    //For assertions
    relatedRule: rule1,
    couriersResponses: [
        {
            courier: courierNOFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
            expectedRowValues: {
                expectedStatus: ORDER_STATUS.PENDING_ACCEPT,
                courier: rule4.provider,
            },
        },
        {
            courier: courierOther,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
            expectedRowValues: {
                //expectedStatus: ORDER_STATUS.INCIDENCE,
                courier: rule5.provider,
            },
        },
    ],
};

if (TEST_NEW_SHIPPER) {
    order5.couriersResponses = [
        {
            courier: courierFixedPrice,
            sendResponse: 'ACCEPT',
            hasFixedPrice: false,
            setPrice: '19.15',
        },
    ];
    order6.couriersResponses = [
        {
            courier: courierFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
        },
    ];
    order7.couriersResponses = [
        {
            courier: courierFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
        },
    ];
    order9.couriersResponses = [
        {
            courier: courierFixedPrice,
            sendResponse: 'REJECT',
            hasFixedPrice: false,
        },
    ];
}

const ordersPendingToAssignment = TEST_NEW_SHIPPER
    ? [
          order1,
          order2,
          order3,
          order4,
          order5,
          order6, // Maybe the final status changes in the future with a fixture
          order7,
          order9,
      ]
    : process.env.ENVIRONMENT === 'pre'
      ? [
            order1,
            order2,
            order3,
            order5,
            order6, // Maybe the final status changes in the future with a fixture
            order8,
            order9,
        ]
      : [
            order1,
            order2,
            order3,
            order4,
            order5,
            order6, // Maybe the final status changes in the future with a fixture
            order7,
            order8,
            order9,
        ];

ordersPendingToAssignment.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const reference: string = await createNewOrder(page, orderTest, testIndex);

        await checkOrderAndAssignCourier(page, reference);

        test.slow();

        if (orderTest.relatedRule.provider === 'BAJO COTIZACIÓN') {
            await assertTextInRow(page, reference, ORDER_STATUS.PENDING_PRICING);
        } else {
            await assertTextInRow(page, reference, ORDER_STATUS.PENDING_ACCEPT);
        }

        const orderId: string = await getOrderId(page, reference);
        logger.info(`3.acceptAndReject.spec.ts orderId: ${orderId}`);

        await logout(page);
        await waitForTimeout(page, 2);

        test.slow();

        if (orderTest.relatedRule.provider === 'BAJO COTIZACIÓN') {
            for (let index = 0; index < orderTest.couriersResponses.length; index++) {
                const courierResponse: CourierResponseOffer = orderTest.couriersResponses[index];
                await acceptOrReject(page, courierResponse, orderId);
                await waitForTimeout(page);
            }

            test.slow();

            await navigateToOrdersPageRoutine(page);
            await waitForTimeout(page);

            await goToOrderDetailPageAndAssignOfferPrice(page, orderId);
            await waitForTimeout(page, 2);

            await assertValuesInRow(page, reference, orderTest.expectedRowValues!);
            await waitForTimeout(page);
        } else {
            for (let index = 0; index < orderTest.couriersResponses.length; index++) {
                const courierResponse: CourierResponseOffer = orderTest.couriersResponses[index];
                await acceptOrReject(page, courierResponse, orderId);
                await waitForTimeout(page, 2);

                await assertValuesInRow(page, reference, courierResponse.expectedRowValues!);
                await logout(page);
                await waitForTimeout(page, 2);
            }
        }
    });
});
