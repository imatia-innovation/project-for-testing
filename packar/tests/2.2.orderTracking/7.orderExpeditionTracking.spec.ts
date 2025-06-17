// Change status with Provider and assert status with Client user

import test, { expect, Locator, Page } from '@playwright/test';
import { createExpeditionWithOrders } from '../../functions/steps/orderTracking/createExpeditionSteps';
import { courierNOFixedPrice, PICKUP_LOCATION, DESTINATION_FAVORITE, TIMEOUT } from '../../constants';
import { selectBox } from '../../functions/steps/ordersSteps';
import ExpeditionTest from '../../interfaces/ExpeditionTest';
import {
    confirmDeliveryModalAssertions,
    expeditionDetailPageRoutine,
    expeditionHomePageRoutine,
    saveIncidence,
    selectOrderAndStatus,
} from '../../functions/steps/orderTracking/orderExpeditionTrackingSteps';
import ExpeditionTestResult from '../../interfaces/ExpeditionTestResult';
import { clickOnText } from '../../functions/utils/clickOnText';
import logger from '../../functions/utils/logger';
import assertByText from '../../functions/utils/assertByText';
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

    logger.info('orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);
});

test('should navigate to expedition detail page', async ({ page }) => {
    logger.info('orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);
    await expeditionDetailPageRoutine(page, expeditionReferences);
});

test('should set Incidence on the order', async ({ page }) => {
    logger.info('orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);

    await expeditionDetailPageRoutine(page, expeditionReferences);

    const incidenceTextLocator: Locator = page.getByText('Incidencia');
    const incidenceBtnLocators: Locator[] = await incidenceTextLocator.all();
    logger.info('orderExpeditionTracking.spec.ts Incidence buttons number: ', incidenceBtnLocators.length);

    await saveIncidence(page, incidenceBtnLocators.length - 1, 'Esto es un test automatizado');

    logger.info('orderExpeditionTracking.spec.ts Incidence buttons number: ', incidenceBtnLocators.length);

    const incidenceTextLocator2: Locator = page.getByText('Incidencia');
    const incidenceBtnLocators2: Locator[] = await incidenceTextLocator2.all();
    logger.info('orderExpeditionTracking.spec.ts Incidence buttons number: ', incidenceBtnLocators2.length);

    expect(incidenceBtnLocators2.length > incidenceBtnLocators.length).toBeTruthy();
});

test('should set Received on the order', async ({ page }) => {
    logger.info('orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);

    await expeditionDetailPageRoutine(page, expeditionReferences);

    const orderIndex: number = 0; // first order
    const statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);
});

test('should set On route on the order', async ({ page }) => {
    logger.info('orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);

    await expeditionDetailPageRoutine(page, expeditionReferences);

    const orderIndex: number = 0; // first order
    let statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);

    statusIndex = 2; // on route
    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.ON_ROUTE);
});

test('should set Delivered on the order', async ({ page }) => {
    logger.info('orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);

    await expeditionDetailPageRoutine(page, expeditionReferences);

    const orderIndex: number = 0; // first order
    let statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);

    statusIndex = 2; // on route
    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.ON_ROUTE);

    const confirmDeliveryTextLocator: Locator = page.getByText('Confirmar entrega');
    const confirmDeliveryBtnLocators: Locator[] = await confirmDeliveryTextLocator.all();
    logger.info('orderExpeditionTracking.spec.ts Incidence buttons number: ', confirmDeliveryBtnLocators.length);

    expect(confirmDeliveryBtnLocators.length).toEqual(expeditionReferences.orderReferences.length);

    await confirmDeliveryBtnLocators[orderIndex].click();
    await confirmDeliveryModalAssertions(page);

    await page.getByText('DNI').nth(0).fill('03915150K');
    await clickOnText(page, 'Guardar');

    await page.waitForTimeout(TIMEOUT);

    await assertByText(page, ORDER_STATUS.SENT);
});

test('should create incidences between states on the order', async ({ page }) => {
    logger.info('orderExpeditionTracking.spec.ts expeditionReferences:', expeditionReferences);

    await expeditionDetailPageRoutine(page, expeditionReferences);

    const orderIndex: number = 0; // first order
    let statusIndex: number = 1; // received

    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.RECEIVED);

    await saveIncidence(page, 0, 'Esto es un test automatizado 1');
    await page.waitForTimeout(TIMEOUT);

    await saveIncidence(page, 2, 'Esto es un test automatizado 2');
    await page.waitForTimeout(TIMEOUT);

    statusIndex = 2; // on route
    await selectOrderAndStatus(page, orderIndex, statusIndex);
    await assertByText(page, ORDER_STATUS.ON_ROUTE);

    await saveIncidence(page, 0, 'Esto es un test automatizado 3');
    await page.waitForTimeout(TIMEOUT);

    await saveIncidence(page, 2, 'Esto es un test automatizado 4');
    await page.waitForTimeout(TIMEOUT);

    await saveIncidence(page, 2, 'Esto es un test automatizado 5');
    await page.waitForTimeout(TIMEOUT);

    const confirmDeliveryTextLocator: Locator = page.getByText('Confirmar entrega');
    const confirmDeliveryBtnLocators: Locator[] = await confirmDeliveryTextLocator.all();
    logger.info('orderExpeditionTracking.spec.ts Incidence buttons number: ', confirmDeliveryBtnLocators.length);

    await confirmDeliveryBtnLocators[orderIndex].click();
    await confirmDeliveryModalAssertions(page);

    await page.getByText('DNI').nth(0).fill('03915150K');
    await clickOnText(page, 'Guardar');

    await page.waitForTimeout(TIMEOUT);

    await assertByText(page, ORDER_STATUS.SENT);
});
