import test, { Page, expect } from '@playwright/test';
import { admin, baserUrl, PICKUP_LOCATION, PROVIDER_SERVICES, TIMEOUT } from '../../constants';
import assertList from '../utils/assertList';
import login from './login';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { clickOnButton, clickOnElementById, clickOnText, clickOnTextNth } from '../utils/clickOnText';
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
import { getProviderService } from '../../constants/dev-providers';
import { ASSIGNMENT_METHOD_DEFAULT } from '../../constants/assignmentMethod';
import User from '../../interfaces/User';
import { locateRow } from '../utils/assertTextInRow';

const LABELS_AND_COLUMNS: string[] = [
    'Buscar envíos',
    'Seleccionar fechas',
    'Estado',
    'Nº Referencia Cliente',
    'Nº Referencia Transportista',
    'Transportista',
    'País',
    'Servicio del transportista',
    'Filtrar',
    'Limpiar',
    //
    'Fecha del envío',
    'Nº Referencia Cliente',
    'Nº Referencia Transportista',
    'País',
    'Transportista',
    'Servicio del Transportista',
    'Nº de bultos',
    'Coste',
    'Estado',
    'Etiquetas',
];

const COLUMNS_CREATE_NEW: string[] = [
    'NUEVO ENVÍO',
    'ORIGEN',
    'BULTOS',
    'DESTINO',
    'PROVEEDOR',
    'Bultos asignados',
    'Guardar como Nuevo Destino',
    'Asignar Bulto',
    'Cancelar',
    'Guardar',
    'Ref Cliente',
    'Fecha de recogida',
    'Fecha de entrega',
];

const COLUMNS_AND_LABELS_DETAIL_PAGE: string[] = [
    'Nº REFERENCIA CLIENTE',
    'Cancelar envío',
    'Reasignar pedido',
    //
    'Seguimiento transporte',
    //
    'Bultos',
    'Descargar etiquetas',
    'Número de seguimiento',
    'Estado del bulto',
    'Peso',
    'Alto',
    'Ancho',
    'Largo',
    'Peso volumétrico',
    'Registros por página',
    //
    'Información de recogida',
    'Transportista',
    'Nombre del conductor',
    'Matrícula',
    'Fecha de recogida estimada',
    'Servicio del transportista',
    'Teléfono transportista',
    'Fecha de recogida real',
    // esta sección no está todavía en PRE
    // 'Documentación',
    // 'Subir archivo...',
    // 'Archivos adjuntos',
    //
    'Datos del remitente',
    'Datos del Destinatario',
    'Nombre de la empresa',
    //
    'Dirección',
    'Localidad',
    'País',
    'Correo Electrónico',
    'C.P',
    'Teléfono',
    'Notas/Observaciones',
    //
    'Ofertas Enviadas',
    'Fecha de solicitud',
    'Fecha de respuesta',
    'Transportista',
    'Estado',
    'Precio',
    'Motivo del rechazo',
    'Asignar',
];

export let ORDERS_IDS: string[] = [];

export async function createNewOrder(page: Page, orderTest: CreateNewOrderTest, testIndex: number) {
    await navigateToOrdersPageRoutine(page);

    await navigateToCreateNewOrderForm(page);

    // start fill form
    test.slow();

    await selectPickUpLocation(page, orderTest.pickUpLocation);

    const reference = orderTest.reference + '-' + testIndex;

    await getByLabelAndFill(page, 'Ref Cliente', reference);

    if (orderTest.assignmentMethod) {
        await selectAssignmentMethod(page, orderTest.assignmentMethod);
    }

    if (orderTest.provider)
        await selectProvider(page, getProviderService(orderTest.provider, orderTest.service, PROVIDER_SERVICES)!);

    if (orderTest.limitPrice) {
        await setLimitPrice(page, orderTest.limitPrice);
    }

    await orderTest.selectPackage(page);

    await fillDestinationOrders(page, orderTest.destination);

    await clickOnButton(page, ' Guardar ');

    await assertOrderHome(page);

    const orderCreated = await page.getByText(reference).first().innerHTML();

    expect(orderCreated).toBeTruthy();

    ORDERS_IDS.push(reference);

    return reference;
}

async function selectAssignmentMethod(page: Page, orderAssignmentMethod: string) {
    logger.info('Start ordersSteps.ts selectAssignmentMethod', { orderAssignmentMethod });
    await clickOnText(page, 'Método de asignación');
    orderAssignmentMethod === ASSIGNMENT_METHOD_DEFAULT
        ? await clickOnTextNth(page, orderAssignmentMethod, 1)
        : await clickOnText(page, orderAssignmentMethod);
    logger.info('Finish ordersSteps.ts selectAssignmentMethod');
}

async function setLimitPrice(page: Page, orderLimitPrice: number) {
    logger.info('Start ordersSteps.ts setLimitPrice', { orderLimitPrice });
    await getByIdAndFill(page, 'limit_cost', orderLimitPrice.toString());
    logger.info('Finish ordersSteps.ts setLimitPrice');
}

async function selectPickUpLocation(page: Page, pickUpLocation: string) {
    logger.info(' Start ordersSteps.ts selectPickUpLocation: ', pickUpLocation);
    await clickOnElementById(page, 'pickup_location');
    pickUpLocation === PICKUP_LOCATION
        ? await clickOnTextNth(page, pickUpLocation, 1)
        : await clickOnText(page, pickUpLocation);
    logger.info(' Finish ordersSteps.ts selectPickUpLocation');
}

export async function navigateToOrdersPageRoutine(page: Page) {
    await login(page, admin);

    await clickOnText(page, 'Envíos');

    await assertOrderHome(page);
}

export async function assertOrderHome(page: Page) {
    await waitUntilUrlLoads(page, '/app/main/order');

    await assertList(page, LABELS_AND_COLUMNS);

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
    await page.waitForTimeout(TIMEOUT);
}

export async function assertOrderDetailPageData(page: Page) {
    await assertByText(page, `Nº REFERENCIA CLIENTE: `);
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

export async function assertTextIsNotInRow(page: Page, reference: string, text: string) {
    const { rowText } = await locateRow(page, reference);

    expect(rowText).not.toBeUndefined();
    expect(rowText!.includes(text)).not.toBeTruthy();
}

export async function gotToOrderDetailPage(page: Page, user: User, orderId: string): Promise<void> {
    await login(page, user);

    await page.waitForTimeout(TIMEOUT);

    await page.waitForURL(`${baserUrl}/app/main/home`, {
        waitUntil: 'load',
    });

    await page.waitForTimeout(TIMEOUT);

    await page.goto(`${baserUrl}/app/main/order/${orderId}?isdetail=true`);

    await page.waitForURL(`${baserUrl}/app/main/order/${orderId}?isdetail=true`, {
        waitUntil: 'load',
    });
    await page.waitForTimeout(TIMEOUT);
}

export async function orderDetailPageAssertions(page: Page, order: CreateNewOrderTest, orderStatus: string) {
    await assertList(page, COLUMNS_AND_LABELS_DETAIL_PAGE);

    await assertList(page, [orderStatus, order.pickUpLocation, order.reference]);
}
