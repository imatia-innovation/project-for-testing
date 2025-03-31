import test, { expect } from '@playwright/test';
import {
    assertOrderHome,
    fillDateInput,
    fillDatesInputs,
    fillDestinationOrders,
    navigateToCreateNewOrderForm,
    navigateToOrdersPageRoutine,
    selectBox,
    selectEnvelope,
    selectPallet,
    selectProvider,
} from '../functions/steps/ordersSteps';
import { getProviderService } from '../constants/providers';
import { getByLabelAndFill } from '../functions/utils/getByLabelAndFill';
import Destination from '../interfaces/Destination';
import { clickOnButton } from '../functions/utils/clickOnText';

const columns: string[] = [
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

const createNewColumns: string[] = [
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
    await navigateToOrdersPageRoutine(page, columns);
});

test(`should open the create new order form`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, columns);

    await navigateToCreateNewOrderForm(page, createNewColumns);
});

test(`should fill the create new order form with the minimum fields`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, columns);

    await navigateToCreateNewOrderForm(page, createNewColumns);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('GLS')!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        name: 'Address Test',
        mail: 'user@test.com',
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

    await assertOrderHome(page, columns);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order form with box, pallet and envelope`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, columns);

    await navigateToCreateNewOrderForm(page, createNewColumns);

    // start fill form
    test.slow();

    const orderReference = 'Autotest' + new Date().getTime().toString();

    await getByLabelAndFill(page, 'Ref Cliente', orderReference);

    await selectProvider(page, getProviderService('NARVAL')!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

    await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        name: 'Address Test',
        mail: 'user@test.com',
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

    await assertOrderHome(page, columns);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});

test(`should fill the create new order form with box, pallet and envelope, with date for 1-2 days`, async ({
    page,
}) => {
    await navigateToOrdersPageRoutine(page, columns);

    await navigateToCreateNewOrderForm(page, createNewColumns);

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

    await selectProvider(page, getProviderService('SEUR')!);

    await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

    await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

    await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });

    const destinationInfo: Destination = {
        favorite: 'test', // Select Option
        name: 'Address Test',
        mail: 'user@test.com',
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

    await assertOrderHome(page, columns);

    const orderCreated = await page.getByText(orderReference).first().innerHTML();

    expect(orderCreated).toBeTruthy();
});
