import test, { Locator, Page, expect } from '@playwright/test';
import { admin, baserUrl } from '../../constants';
import assertList from '../utils/assertList';
import login from './login';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { clickOnButton, clickOnElementById, clickOnText } from '../utils/clickOnText';
import Provider from '../../interfaces/Provider';
import { getById } from '../utils/getById';
import Dimension, { CompleteOrderDimension } from '../../interfaces/Dimension';
import { getByLabelAndFill } from '../utils/getByLabelAndFill';
import assertByText from '../utils/assertByText';
import Destination from '../../interfaces/Destination';
import { formatDate } from '../utils/formatDate';
import { getByAttribute } from '../utils/getByAttribute';
import { getByIdAndFill } from '../utils/getByIdAndFill';
import logger from '../utils/logger';
import CreateNewOrderTest from '../../interfaces/CreateNewOrderTest';
import { getProviderService } from '../../constants/providers';

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

export let ORDERS_IDS: string[] = [];

export async function createNewOrder(page: Page, orderTest: CreateNewOrderTest, testIndex: number) {
    await navigateToOrdersPageRoutine(page);

    await navigateToCreateNewOrderForm(page);

    // start fill form
    test.slow();

    const reference = orderTest.reference + '-' + testIndex;

    await getByLabelAndFill(page, 'Ref Cliente', reference);

    if (orderTest.provider) await selectProvider(page, getProviderService(orderTest.provider, orderTest.service)!);

    await orderTest.executeFunctions(page);

    await fillDestinationOrders(page, orderTest.destination);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page);

    const orderCreated = await page.getByText(reference).first().innerHTML();

    expect(orderCreated).toBeTruthy();

    ORDERS_IDS.push(reference);

    return reference;
}

export async function navigateToOrdersPageRoutine(page: Page) {
    await login(page, admin);

    await clickOnText(page, 'Envíos');

    await assertOrderHome(page);
}

export async function assertOrderHome(page: Page) {
    await waitUntilUrlLoads(page, '/app/main/order');

    await assertList(page, COLUMNS);

    const createNewLocator = await page.locator('button').getByText('Nuevo').count();
    expect(createNewLocator).not.toBe(0);

    const assignLocator = await page.locator('button').getByText('Asignar').count();
    expect(assignLocator).not.toBe(0);

    const filterLocator = await page.locator('button').getByText('Filtrar').count();
    expect(filterLocator).not.toBe(0);

    const cleanLocator = await page.locator('button').getByText('Limpiar').count();
    expect(cleanLocator).not.toBe(0);
}

export async function navigateToCreateNewOrderForm(page: Page) {
    const createNewLocator = page.locator('button').getByText('Nuevo');
    await createNewLocator.click();

    await waitUntilUrlLoads(page, '/app/main/order/new');
    await assertList(page, COLUMNS_CREATE_NEW);
}

function getMonthChanged(date: Date, compareDate: Date): { montDifference: number; monthChanged: boolean } {
    return {
        montDifference: date.getMonth() - compareDate.getMonth(),
        monthChanged: date.getMonth() - compareDate.getMonth() != 0,
    };
}

export async function fillDatesInputs(page: Page, startDate: Date, endDate: Date, now: Date) {
    await fillDateInput(page, 0, 'requested_pickup_date', startDate, now);

    await fillDateInput(page, 1, 'requested_delivery_date', endDate, startDate);
}

export async function fillDateInput(page: Page, order: number, id: string, date: Date, compareDate: Date) {
    logger.info('Start ordersSteps.ts fillDateInput', { order, id, date, compareDate });
    await clickOnButton(page, 'today', order);

    const { montDifference, monthChanged } = getMonthChanged(date, compareDate);

    logger.info('  ordersSteps.ts fillDateInput', { montDifference, monthChanged });

    if (monthChanged) {
        for (let i = 0; i < montDifference; i++) {
            await clickOnButton(page, '', 1);
        }
    }

    await clickOnButton(page, ' ' + date.getDate().toString() + ' ');

    const inputLocator = getById(page, id);
    const value = await inputLocator.inputValue();

    expect(value).toEqual(formatDate(date));
    logger.info('Finish ordersSteps.ts fillDateInput');
}

export async function selectProvider(page: Page, provider: Provider) {
    const providerLabel = getByAttribute(page, 'key', 'courier_id');
    await providerLabel.click();

    const providerLocators = page.getByText(provider.name);
    await providerLocators.last().click();

    const service = getByAttribute(page, 'service', 'courierShipmentTypeUser').nth(1);
    await service.click();

    const serviceLocators = page.getByText(provider.service);
    await serviceLocators.last().click();
}

export async function selectBox(page: Page, { length, width, height, weight }: Dimension) {
    await clickOnButton(page, 'Cajas');

    await getByLabelAndFill(page, 'Largo (cm)', length.toString());

    await getByLabelAndFill(page, 'Ancho (cm)', width.toString());

    await getByLabelAndFill(page, 'Alto (cm)', height.toString());

    await getByLabelAndFill(page, 'Peso (Kg)', weight.toString());

    await clickOnButton(page, ' Asignar Bulto ');

    await assertByText(page, 'BOX');

    await assertByText(page, `${length} cm x ${width} cm x ${height} cm`);

    await assertByText(page, `${weight} Kg`);
}

export async function selectCompleteOrder(page: Page, { boxQty, weight }: CompleteOrderDimension) {
    await clickOnButton(page, 'Pedido Completo');

    await getByLabelAndFill(page, 'Número de Cajas', boxQty.toString());

    await getByLabelAndFill(page, 'Peso (Kg)', weight.toString());

    await clickOnButton(page, ' Asignar Bulto ');

    const weightSplitted = (weight / boxQty).toFixed(2);

    await assertByText(page, 'BOX');

    await assertByText(page, 'Pedido Completo');

    await assertByText(page, `${weightSplitted} Kg`);
}

export async function selectPallet(
    page: Page,
    type: string,
    { length, width, height, weight }: Dimension,
    packagesQty: number
) {
    await clickOnButton(page, 'Palets');

    await clickOnButton(page, type);

    switch (type) {
        case 'Europalet':
            await getByLabelAndFill(page, 'Alto (cm)', height.toString());

            await getByLabelAndFill(page, 'Peso (Kg)', weight.toString());

            await getByLabelAndFill(page, 'Num. Bultos', packagesQty.toString());

            await clickOnButton(page, ' Asignar Bulto ');

            await assertByText(page, `${80} cm x ${120} cm x ${height} cm`);

            await assertByText(page, `${weight} Kg`);

            break;

        case 'Isopalet':
            await getByLabelAndFill(page, 'Alto (cm)', height.toString());

            await getByLabelAndFill(page, 'Peso (Kg)', weight.toString());

            await getByLabelAndFill(page, 'Num. Bultos', packagesQty.toString());

            await clickOnButton(page, ' Asignar Bulto ');

            await assertByText(page, `${100} cm x ${120} cm x ${height} cm`);

            await assertByText(page, `${weight} Kg`);

            break;

        case 'Custom':
            await getByLabelAndFill(page, 'Largo (cm)', length.toString());

            await getByLabelAndFill(page, 'Ancho (cm)', width.toString());

            await getByLabelAndFill(page, 'Alto (cm)', height.toString());

            await getByLabelAndFill(page, 'Peso (Kg)', weight.toString());

            await getByLabelAndFill(page, 'Num. Bultos', packagesQty.toString());

            await clickOnButton(page, ' Asignar Bulto ');

            await assertByText(page, `${length} cm x ${width} cm x ${height} cm`);

            await assertByText(page, `${weight} Kg`);

            break;
        default:
            break;
    }
}

export async function selectEnvelope(page: Page, { length, width, height, weight }: Dimension) {
    await clickOnButton(page, 'Sobres');

    await getByLabelAndFill(page, 'Largo (cm)', length.toString());

    await getByLabelAndFill(page, 'Ancho (cm)', width.toString());

    await getByLabelAndFill(page, 'Alto (cm)', height.toString());

    await getByLabelAndFill(page, 'Peso (Kg)', weight.toString());

    await clickOnButton(page, ' Asignar Bulto ');

    await assertByText(page, 'ENVELOPE');

    await assertByText(page, `${length} cm x ${width} cm x ${height} cm`);

    await assertByText(page, `${weight} Kg`);
}

export async function fillDestinationOrders(page: Page, destination: Destination) {
    if (destination.favorite) {
        // Auto filled inputs are: mail, phone, address, zipCode, population and country
        await clickOnElementById(page, 'destination');
        await clickOnText(page, destination.favorite);

        const remarkLocator = await clickOnElementById(page, 'remarks');
        await remarkLocator.fill(destination.remarks);
    } else {
        await getByIdAndFill(page, 'addressName', destination.name!);

        if (destination.mail) {
            await getByIdAndFill(page, 'email', destination.mail);
        }

        if (destination.phone) {
            await getByIdAndFill(page, 'phone1', destination.phone);
        }

        if (destination.phoneSecondary) {
            await getByIdAndFill(page, 'phone2', destination.phoneSecondary);
        }

        // 'Dirección *'
        await getByIdAndFill(page, 'street', destination.address!);

        await getByIdAndFill(page, 'zipCode', destination.zipCode!);

        await getByIdAndFill(page, 'city', destination.population!);

        if (!destination.country) {
            await clickOnElementById(page, 'country');
            await clickOnText(page, 'Spain');
        }

        if (destination.country && destination.country != 'Spain') {
            await clickOnElementById(page, 'country');
            await clickOnText(page, destination.country);
        }

        await getByIdAndFill(page, 'remarks', destination.remarks);
    }
}

export async function navigateToOrderDetailPage(page: Page, orderId: string) {
    await page.goto(baserUrl + `/app/main/order/${orderId}?isdetail=true`);

    await page.waitForURL(baserUrl + `/app/main/order/${orderId}?isdetail=true`);
}

export async function assertOrderDetailPageData(page: Page) {
    await assertByText(page, `Nº REFERENCIA CLIENTE: `);
}

export async function locateRow(page: Page, reference: string) {
    const rowsLocators: Locator = page.getByRole('row');

    const rowsLocatorsArray: Locator[] = await rowsLocators.all();

    let rows = [];

    for (let index = 0; index < rowsLocatorsArray.length; index++) {
        const rowLocator: Locator = rowsLocatorsArray[index];

        const innerText: null | string = await rowLocator.innerText();

        if (innerText) {
            const rowTexts: string[] = innerText.replace(/\t\n/g, '').split(/\n/g);
            const rowText: string = rowTexts.join(',');
            rows.push(rowText);
        }
    }

    let index = 0;
    const row = rows.find((row, i) => {
        index = i;
        return row.includes(reference);
    });

    return { rowsLocators, index, rowLocator: rowsLocators.nth(index), rowText: row };
}

export async function checkRow(page: Page, reference: string, attribute: string, value: string) {
    const { rowLocator } = await locateRow(page, reference);

    const checkboxOnRow = rowLocator.locator(`[${attribute}='${value}']`).first();

    await checkboxOnRow.click();
}

export async function checkHeaderRow(page: Page) {
    const checkboxOnRow = page.getByRole('columnheader').first();

    await checkboxOnRow.click();
}

export async function assertTextInRow(page: Page, reference: string, text: string) {
    const { rowText } = await locateRow(page, reference);

    expect(rowText).not.toBeUndefined();
    expect(rowText!.includes(text)).toBeTruthy();
}

export async function assertTextIsNotInRow(page: Page, reference: string, text: string) {
    const { rowText } = await locateRow(page, reference);

    expect(rowText).not.toBeUndefined();
    expect(rowText!.includes(text)).not.toBeTruthy();
}
