import test, { expect } from '@playwright/test';
import {
    assertOrderDetailPageData,
    assertOrderHome,
    fillDatesInputs,
    fillDestinationOrders,
    navigateToCreateNewOrderForm,
    navigateToOrderDetailPage,
    navigateToOrdersPageRoutine,
    selectBox,
    selectCompleteOrder,
    selectEnvelope,
    selectPallet,
    selectProvider,
} from '../functions/steps/ordersSteps';
import { getProviderService } from '../constants/providers';
import { getByLabelAndFill } from '../functions/utils/getByLabelAndFill';
import Destination from '../interfaces/Destination';
import { clickOnButton } from '../functions/utils/clickOnText';

const ORDER_ID = '140';

const COLUMNS: string[] = [
    'Buscar envíos',
    'Fecha del envío',
    'Nº Referencia Cliente',
    'Nº Referencia Transportista',
    'País',
    'Transportista',
    'Servicio del Transportista',
    'Nº de bultos',
    'Estado',
    'Etiquetas',
];

const COLUMNS_CRETE_NEW: string[] = [
    'NUEVO ENVÍO',
    'ORIGEN',
    'BULTOS',
    'DESTINO',
    'Bultos asignados',
    'Guardar como Nuevo Destino',
    'Asignar Bulto',
    'Cancelar',
    'Guardar',
    'Ref Cliente',
    'Fecha de recogida',
    'Fecha de entrega',
];

test(`should go to the Orders Section and make assertions`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);
});

test(`should open the create new order form`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);
});

test(`should fill the create new order form with the minimum fields selecting Partial Order`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('GLS')!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order form with the minimum fields selecting Complete Order`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('NARVAL')!);

    await selectCompleteOrder(page, { boxQty: 2, weight: 36 });

    await selectCompleteOrder(page, { boxQty: 3, weight: 36 });

    await selectCompleteOrder(page, { boxQty: 4, weight: 36 });

    await selectCompleteOrder(page, { boxQty: 5, weight: 36 });

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order form with box, pallet and envelope`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('SEUR')!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

    await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order form with box, pallet and envelope, with date for 1-2 days`, async ({
    page,
}) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    const now = new Date();

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + 1);

    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 2);

    await fillDatesInputs(page, startDate, endDate, now);

    const { name: courier, service: courierService } = getProviderService('STEF')!;
    await selectProvider(page, { name: courier, service: courierService });

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

    await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order with various pallets`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    const { name: courier, service: courierService } = getProviderService('CORREOS')!;
    await selectProvider(page, { name: courier, service: courierService });

    await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

    await selectPallet(page, 'Isopalet', { length: 5, width: 20, height: 30, weight: 50 }, 6);

    await selectPallet(page, 'Custom', { length: 5, width: 20, height: 30, weight: 50 }, 9);

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order using dynamic destination with email`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('GLS', 1)!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    const destinationInfo: Destination = {
        name: 'Address Test',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order using dynamic destination with phone number`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('NARVAL', 1)!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    const destinationInfo: Destination = {
        name: 'Address Test',

        phone: '643222299',
        phoneSecondary: '643222299',
        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order using dynamic destination with email and select other country`, async ({
    page,
}) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CRETE_NEW);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('SEUR', 1)!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    const destinationInfo: Destination = {
        name: 'Address Test',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Portugal', // Select Option
        saveAsNew: false,
        remarks: 'This is an automatic test',
    };

    await fillDestinationOrders(page, destinationInfo);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page, COLUMNS);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should go to an order detail page`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToOrderDetailPage(page, ORDER_ID);

    await assertOrderDetailPageData(page);
});
