import test, { expect, Page } from '@playwright/test';
import {
    assertOrderDetailPageData,
    assertOrderHome,
    assertTextInRow,
    assertTextIsNotInRow,
    checkHeaderRow,
    checkRow,
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
import { clickOnButton } from '../functions/utils/clickOnText';
import CreateNewOrderTest from '../interfaces/CreateNewOrderTest';

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

const COLUMNS_CREATE_NEW: string[] = [
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

const order1: CreateNewOrderTest = {
    title: 'should fill the create new order form with the minimum fields selecting Partial Order',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'GLS',
    service: 0,
    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order2: CreateNewOrderTest = {
    title: 'should fill the create new order form with the minimum fields selecting Complete Order',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'NARVAL',
    service: 0,
    executeFunctions: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 2, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 3, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 4, weight: 36 });

        await selectCompleteOrder(page, { boxQty: 5, weight: 36 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order3: CreateNewOrderTest = {
    title: 'should fill the create new order form with box, pallet and envelope',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'SEUR',
    service: 0,
    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

        await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

        await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order4: CreateNewOrderTest = {
    title: 'should fill the create new order form with box, pallet and envelope, with date for 1-2 days',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'STEF',
    service: 0,
    executeFunctions: async (page: Page) => {
        const now = new Date();

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() + 1);

        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 2);

        await fillDatesInputs(page, startDate, endDate, now);

        await selectBox(page, { length: 5, width: 20, height: 30, weight: 50 });

        await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

        await selectEnvelope(page, { length: 10, width: 100, height: 200, weight: 14 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order5: CreateNewOrderTest = {
    title: 'should fill the create new order with various pallets',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'CORREOS',
    service: 0,
    executeFunctions: async (page: Page) => {
        await selectPallet(page, 'Europalet', { length: 5, width: 20, height: 30, weight: 50 }, 3);

        await selectPallet(page, 'Isopalet', { length: 5, width: 20, height: 30, weight: 50 }, 6);

        await selectPallet(page, 'Custom', { length: 5, width: 20, height: 30, weight: 50 }, 9);
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order6: CreateNewOrderTest = {
    title: 'should fill the create new order using dynamic destination with email',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'GLS',
    service: 1,
    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 15, width: 25, height: 35, weight: 55 });
    },
    destination: {
        name: 'Address Test',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order7: CreateNewOrderTest = {
    title: 'should fill the create new order using dynamic destination with phone number',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'NARVAL',
    service: 1,
    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 11, width: 22, height: 33, weight: 44 });
    },
    destination: {
        name: 'Address Test',

        phone: '643222299',
        phoneSecondary: '643222299',
        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order8: CreateNewOrderTest = {
    title: 'should fill the create new order using dynamic destination with email and select other country',
    reference: 'Autotest' + new Date().getTime().toString(),
    provider: 'SEUR',
    service: 1,
    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 100, width: 200, height: 300, weight: 500 });
    },
    destination: {
        name: 'Address Test',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Portugal',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};
const order9: CreateNewOrderTest = {
    title: 'should create an order without provider',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 100, width: 200, height: 300, weight: 500 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order10: CreateNewOrderTest = {
    title: 'should create an order without provider length: 99, width: 99, height: 99, weight: 99',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 99, width: 99, height: 99, weight: 99 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order11: CreateNewOrderTest = {
    title: 'should create an order without provider length: 100, width: 100, height: 100, weight: 100',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 100, width: 100, height: 100, weight: 100 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order12: CreateNewOrderTest = {
    title: 'should create an order without provider length: 101, width: 101, height: 101, weight: 101',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 101, width: 101, height: 101, weight: 101 });
    },
    destination: {
        favorite: 'test',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order13: CreateNewOrderTest = {
    title: 'order with destination name containing AAA',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 500, width: 500, height: 500, weight: 500 });
    },
    destination: {
        name: 'Address Test AAA',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order14: CreateNewOrderTest = {
    title: 'order with destination name containing bbbAAAccc',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectBox(page, { length: 499, width: 499, height: 499, weight: 499 });
    },
    destination: {
        name: 'Address Test bbbAAAccc',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order15: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa and boxQty: 50, weight: 50',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 50, weight: 50 });
    },
    destination: {
        name: 'Address Test aaa123aaa',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order16: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa and boxQty: 51, weight: 51',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 51, weight: 51 });
    },
    destination: {
        name: 'Address Test aaa123aaa',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

const order17: CreateNewOrderTest = {
    title: 'order with destination name containing aaa123aaa and boxQty: 49, weight: 49',
    reference: 'Autotest' + new Date().getTime().toString(),

    executeFunctions: async (page: Page) => {
        await selectCompleteOrder(page, { boxQty: 49, weight: 49 });
    },
    destination: {
        name: 'Address Test aaa123aaa',
        mail: 'user@test.com',

        address: 'Address Test',
        zipCode: '27600',
        population: 'Lugo',
        country: 'Spain',
        saveAsNew: false,
        remarks: 'This is an automatic test',
    },
};

// order1, order2, order3, order4, order5, order6, order7, order8, order9
const createOrdersTests: CreateNewOrderTest[] = [
    order1,
    order2,
    order3,
    order4,
    order5,
    order6,
    order7,
    order8,
    order9,
];

// order10, order11, order12, order13, order14, order15, order16, order17
const ordersPendingToAssignment = [order10, order11, order12, order13, order14, order15, order16, order17];

let orderIds: string[] = [];

test.afterAll('delete tests rules created in the past', async () => {
    console.log('created orders references: ', { orderIds });
});

test(`should go to the Orders Section and make assertions`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);
});

test(`should go to an order detail page`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToOrderDetailPage(page, ORDER_ID);

    await assertOrderDetailPageData(page);
});

test(`should open the create new order form`, async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CREATE_NEW);
});

createOrdersTests.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        await createNewOrder(page, orderTest, testIndex);
    });
});

async function createNewOrder(page: Page, orderTest: CreateNewOrderTest, testIndex: number) {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await navigateToCreateNewOrderForm(page, COLUMNS_CREATE_NEW);

    // start fill form
    test.slow();

    const reference = orderTest.reference + '-' + testIndex;

    await getByLabelAndFill(page, 'Ref Cliente', reference);

    if (orderTest.provider) await selectProvider(page, getProviderService(orderTest.provider, orderTest.service)!);

    await orderTest.executeFunctions(page);

    await fillDestinationOrders(page, orderTest.destination);

    await clickOnButton(page, ' Guardar ');

    // await assertOrderHome(page, COLUMNS);

    // const orderCreated = await page.getByText(reference).first().innerHTML();

    // expect(orderCreated).toBeTruthy();

    // orderIds.push(reference);

    return reference;
}

let pendingOrdersReferences: string[] = [];

ordersPendingToAssignment.forEach((orderTest, testIndex) => {
    test(orderTest.title, async ({ page }) => {
        const reference: string = await createNewOrder(page, orderTest, testIndex + createOrdersTests.length);

        pendingOrdersReferences.push(reference);

        //await assertTextInRow(page, reference, 'PENDING ASSIGNMENT');
    });
});

test('it should mark all pending tests and assign a provider', async ({ page }) => {
    await navigateToOrdersPageRoutine(page, COLUMNS);

    await checkHeaderRow(page);

    await clickOnButton(page, 'sendAsignar'); // if it throws error, means that it does not reaches a rule, so you must create a rule before this test

    test.slow();

    await navigateToOrdersPageRoutine(page, COLUMNS);

    for (let index = 0; index < pendingOrdersReferences.length; index++) {
        const reference = pendingOrdersReferences[index];
        await assertTextIsNotInRow(page, reference, 'PENDING ASSIGNMENT');
    }
});
