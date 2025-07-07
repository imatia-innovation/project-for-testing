// Get accepted orders ids
//if I have not assigned orders for my courier, the create 5 orders and accept them before star tests
// Here create expedition with order ids

import test, { Page } from '@playwright/test';
import { courierFixedPrice, courierNOFixedPrice, DESTINATION_FAVORITE, PICKUP_LOCATION } from '../../constants';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { createExpeditionWithOrders } from '../../functions/steps/orderTracking/createExpeditionSteps';
import { selectBox } from '../../functions/steps/ordersSteps';
import ExpeditionTest from '../../interfaces/ExpeditionTest';

const expedition1: ExpeditionTest = {
    title: `should create automatically an Expedition courierNOFixedPrice ${courierNOFixedPrice.providerName} `,
    courier: courierNOFixedPrice,
    order: {
        title: 'generic order for expedition',
        pickUpLocation: PICKUP_LOCATION,
        reference: 'atest' + new Date().getTime().toString() + '-1',
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
        setPrice: '55',
        courierHasFixedPrice: false,
        assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
    },
};

const expedition2: ExpeditionTest = {
    title: `should create automatically an Expedition courierFixedPrice ${courierFixedPrice.providerName} `,
    courier: courierFixedPrice,
    order: {
        title: 'generic order for expedition',
        pickUpLocation: PICKUP_LOCATION,
        reference: 'atest' + new Date().getTime().toString() + '-2',
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
    },
};

const expeditionTests = [expedition1, expedition2];

expeditionTests.forEach((expeditionTest) => {
    test(expeditionTest.title, async ({ page }) => {
        const qtyOrders: number = 1;
        await createExpeditionWithOrders(page, expeditionTest, qtyOrders);
    });
});
