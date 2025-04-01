import { Locator, Page, expect } from '@playwright/test';
import { admin, baserUrl } from '../../constants';
import assertList from '../utils/assertList';
import login from './login';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { clickOnButton, clickOnElementById, clickOnText } from '../utils/clickOnText';
import Provider from '../../interfaces/Provider';
import { labelChangesByProviderOrder } from './providerSelectOption';
import { getById } from '../utils/getById';
import Dimension, { CompleteOrderDimension } from '../../interfaces/Dimension';
import { getByLabelAndFill } from '../utils/getByLabelAndFill';
import assertByText from '../utils/assertByText';
import Destination from '../../interfaces/Destination';
import { formatDate } from '../utils/formatDate';

export async function navigateToOrdersPageRoutine(page: Page, columns: string[]) {
    await login(page, admin);

    await clickOnText(page, 'Envíos');

    await assertOrderHome(page, columns);
}

export async function assertOrderHome(page: Page, columns: string[]) {
    await waitUntilUrlLoads(page, '/app/main/order');

    await assertList(page, columns);

    const createNewLocator = await page.locator('button').getByText('Nuevo').count();
    expect(createNewLocator).not.toBe(0);

    const assignLocator = await page.locator('button').getByText('Asignar').count();
    expect(assignLocator).not.toBe(0);

    const filterLocator = await page.locator('button').getByText('Filtrar').count();
    expect(filterLocator).not.toBe(0);

    const cleanLocator = await page.locator('button').getByText('Limpiar').count();
    expect(cleanLocator).not.toBe(0);
}

export async function navigateToCreateNewOrderForm(page: Page, createNewColumns: string[]) {
    const createNewLocator = page.locator('button').getByText('Nuevo');
    await createNewLocator.click();

    await waitUntilUrlLoads(page, '/app/main/order/new');
    await assertList(page, createNewColumns);
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
    await clickOnButton(page, 'today', order);

    const { montDifference, monthChanged } = getMonthChanged(date, compareDate);

    if (monthChanged) {
        for (let i = 0; i < montDifference; i++) {
            await clickOnButton(page, '', 1);
        }
    }

    await clickOnButton(page, date.getDate().toString());

    const inputLocator = getById(page, id);
    const value = await inputLocator.inputValue();

    expect(value).toEqual(formatDate(date));
}

export async function selectProvider(page: Page, provider: Provider) {
    const providerLabel = page.getByLabel('Transportista');
    await providerLabel.click();

    const providerLocators = page.getByText(provider.name);
    await providerLocators.last().click();

    const label: string = labelChangesByProviderOrder(provider.name);

    const service = page.getByLabel(label);
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
        console.log('AQUI ESTOY 1');

        await getByLabelAndFill(page, 'Nombre de Dirección *', destination.name!);

        let phoneLabel = 'Teléfono *';

        if (destination.mail) {
            await getByLabelAndFill(page, 'Mail *', destination.mail);
            phoneLabel = 'Teléfono';
        }

        if (destination.phone) {
            await getByLabelAndFill(page, phoneLabel, destination.phone);
        }

        if (destination.phoneSecondary)
            await getByLabelAndFill(page, 'Teléfono Secundario', destination.phoneSecondary);

        // 'Dirección *'
        const streetLocator = await clickOnElementById(page, 'street');
        await streetLocator.fill(destination.address!);

        await getByLabelAndFill(page, 'Codigo postal *', destination.zipCode!);

        await getByLabelAndFill(page, 'Población *', destination.population!);

        if (!destination.country) {
            await clickOnElementById(page, 'country');
            await clickOnText(page, 'Spain');
        }

        if (destination.country && destination.country != 'Spain') {
            await clickOnElementById(page, 'country');
            await clickOnText(page, destination.country);
        }

        await getByLabelAndFill(page, 'Observaciones', destination.remarks);

        console.log('AQUI ESTOY 2');
    }
}

export async function navigateToOrderDetailPage(page: Page, orderId: string) {
    await page.goto(baserUrl + `/app/main/order/${orderId}?isdetail=true`);

    await page.waitForURL(baserUrl + `/app/main/order/${orderId}?isdetail=true`);
}

export async function assertOrderDetailPageData(page: Page) {
    await assertByText(page, `Nº REFERENCIA CLIENTE: `);
}
