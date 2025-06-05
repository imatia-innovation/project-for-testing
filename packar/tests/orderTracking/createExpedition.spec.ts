// Get accepted orders ids
//if I have not assigned orders for my courier, the create 5 orders and accept them before star tests
// Here create expedition with order ids

import test, { Page } from '@playwright/test';
import { courierFixedPrice, courierNOFixedPrice, destinationFavorite, pickUpLocation } from '../../constants';
import { createExpeditionWithOrders } from '../../functions/steps/orderTracking/createExpeditionSteps';
import { selectBox } from '../../functions/steps/ordersSteps';
import ExpeditionTest from '../../interfaces/ExpeditionTest';

const expedition1: ExpeditionTest = {
    title: 'should create an Expedition for courier No fixed price',
    courier: courierNOFixedPrice,
    order: {
        title: 'generic order for expedition',
        pickUpLocation,
        reference: 'atest' + new Date().getTime().toString() + '-1',
        provider: courierNOFixedPrice.providerName,
        service: 0,
        selectPackage: async (page: Page) => {
            await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
        },
        destination: {
            favorite: destinationFavorite,
            saveAsNew: false,
            remarks: 'This is an automatic test',
        },
        courier: courierNOFixedPrice,
        setPrice: '55',
        courierHasFixedPrice: false,
    },
};

const expedition2: ExpeditionTest = {
    title: 'should create an Expedition for courier Fixed Price',
    courier: courierFixedPrice,
    order: {
        title: 'generic order for expedition',
        pickUpLocation,
        reference: 'atest' + new Date().getTime().toString() + '-2',
        provider: courierFixedPrice.providerName,
        service: 0,
        selectPackage: async (page: Page) => {
            await selectBox(page, { length: 1, width: 1, height: 1, weight: 1 });
        },
        destination: {
            favorite: destinationFavorite,
            saveAsNew: false,
            remarks: 'This is an automatic test',
        },
        courier: courierFixedPrice,
        courierHasFixedPrice: true,
    },
};

const expeditionTests = [expedition1, expedition2];

expeditionTests.forEach((expeditionTest) => {
    test(expeditionTest.title, async ({ page }) => {
        const qtyOrders: number = 1;
        await createExpeditionWithOrders(page, expeditionTest, qtyOrders);
    });
});
