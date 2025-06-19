// Change status with Provider and assert status with Client user

import test, { expect, Locator, Page } from '@playwright/test';
import { createExpeditionWithOrders } from '../../functions/steps/orderTracking/createExpeditionSteps';
import { courierNOFixedPrice, PICKUP_LOCATION, DESTINATION_FAVORITE } from '../../constants';
import { selectBox } from '../../functions/steps/ordersSteps';
import ExpeditionTest from '../../interfaces/ExpeditionTest';
import {
    changeOfferStatus,
    expeditionDetailPageRoutine,
    expeditionHomePageRoutine,
    saveIncidence,
    selectOnRouteStatus,
    selectReceivedStatus,
    selectSentStatus,
} from '../../functions/steps/orderTracking/orderExpeditionTrackingSteps';
import ExpeditionTestResult from '../../interfaces/ExpeditionTestResult';
import logger from '../../functions/utils/logger';
import { ASSIGNMENT_METHOD } from '../../constants/assignmentMethod';
import { ORDER_STATUS } from '../../constants/orderStatus';

const expedition1: ExpeditionTest = {
    title: 'should create an Expedition for courier No fixed price',
    courier: courierNOFixedPrice,
    order: {
        title: 'generic order for expedition',
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
        setPrice: '129.99',
        courierHasFixedPrice: false,
        assignmentMethod: ASSIGNMENT_METHOD.FIRST_OFFER,
    },
};

let expeditionReferences: ExpeditionTestResult = {
    expeditionCode: '',
    orderReferences: [],
};

test.beforeEach(async ({ page }) => {
    test.slow();

    const uniqueNameForOrderReference = 'atest' + new Date().getTime().toString();
    expedition1.order.reference = uniqueNameForOrderReference;

    const qtyOrders: number = 1;
    expeditionReferences = await createExpeditionWithOrders(page, expedition1, qtyOrders);
});

test('should validate My Expeditions home page', async ({ page }) => {
    await expeditionHomePageRoutine(page, expeditionReferences);
});

test('should navigate to expedition detail page', async ({ page }) => {
    await expeditionDetailPageRoutine(page, expeditionReferences);
});

test('should set Incidence on the order', async ({ page }) => {
    logger.info('7.orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);

    await expeditionDetailPageRoutine(page, expeditionReferences);

    const incidenceTextLocator: Locator = page.getByText('Incidencia');
    const incidenceBtnLocators: Locator[] = await incidenceTextLocator.all();
    logger.info('7.orderExpeditionTracking.spec.ts Incidence buttons number: ', incidenceBtnLocators.length);

    await saveIncidence(page, incidenceBtnLocators.length - 1, 'Esto es un test automatizado');

    logger.info('7.orderExpeditionTracking.spec.ts Incidence buttons number: ', incidenceBtnLocators.length);

    const incidenceTextLocator2: Locator = page.getByText('Incidencia');
    const incidenceBtnLocators2: Locator[] = await incidenceTextLocator2.all();
    logger.info('7.orderExpeditionTracking.spec.ts Incidence buttons number: ', incidenceBtnLocators2.length);

    expect(incidenceBtnLocators2.length > incidenceBtnLocators.length).toBeTruthy();
});

test('should set Received on the order', async ({ page }) => {
    await expeditionDetailPageRoutine(page, expeditionReferences);

    await changeOfferStatus(page, ORDER_STATUS.RECEIVED, expeditionReferences);
});

test('should set On route on the order', async ({ page }) => {
    await expeditionDetailPageRoutine(page, expeditionReferences);

    await changeOfferStatus(page, ORDER_STATUS.ON_ROUTE, expeditionReferences);
});

test('should set Sent on the order', async ({ page }) => {
    await expeditionDetailPageRoutine(page, expeditionReferences);

    await changeOfferStatus(page, ORDER_STATUS.SENT, expeditionReferences);
});

test('should create incidences between states on the order before confirm', async ({ page }) => {
    await expeditionDetailPageRoutine(page, expeditionReferences);

    await selectReceivedStatus(page);

    await saveIncidence(page, 0, 'Esto es un test automatizado 1');

    await saveIncidence(page, 2, 'Esto es un test automatizado 2');

    await selectOnRouteStatus(page);

    await saveIncidence(page, 0, 'Esto es un test automatizado 3');

    await saveIncidence(page, 2, 'Esto es un test automatizado 4');

    await saveIncidence(page, 2, 'Esto es un test automatizado 5');

    await selectSentStatus(page, expeditionReferences);
});

test("should create incidences after 'On route' status ", async ({ page }) => {
    await expeditionDetailPageRoutine(page, expeditionReferences);

    await selectReceivedStatus(page);

    await saveIncidence(page, 0, 'Esto es un test automatizado 1');

    await saveIncidence(page, 2, 'Esto es un test automatizado 2');

    await selectOnRouteStatus(page);

    await saveIncidence(page, 0, 'Esto es un test automatizado 3');

    await saveIncidence(page, 2, 'Esto es un test automatizado 4');

    await saveIncidence(page, 2, 'Esto es un test automatizado 5');
});

test("should create incidences after 'Received' status ", async ({ page }) => {
    await expeditionDetailPageRoutine(page, expeditionReferences);

    await selectReceivedStatus(page);

    await saveIncidence(page, 0, 'Esto es un test automatizado 1');

    await saveIncidence(page, 2, 'Esto es un test automatizado 2');
});
