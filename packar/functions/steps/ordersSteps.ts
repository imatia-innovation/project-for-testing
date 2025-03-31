import { Page, expect } from '@playwright/test';
import { admin } from '../../constants';
import assertList from '../utils/assertList';
import login from './login';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { clickOnButton, clickOnElementById, clickOnText, locateTheButtonIndex } from '../utils/clickOnText';
import Provider from '../../interfaces/Provider';
import { labelChangesByProviderOrder } from './providerSelectOption';
import { getById } from '../utils/getById';
import Dimension from '../../interfaces/Dimension';
import { getByLabelAndFill } from '../utils/getByLabelAndFill';
import assertByText from '../utils/assertByText';
import Destination from '../../interfaces/Destination';

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

    const day: number = date.getDate();
    const month: number = date.getMonth() + 1;
    const formatDate = `${day.toString().length === 1 ? '0' + day : day}/${month.toString().length === 1 ? '0' + month : month}/${date.getFullYear()}`;
    
    expect(value).toEqual(formatDate);
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

export async function selectPallet(
    page: Page,
    type: string,
    { length, width, height, weight }: Dimension,
    packagesQty: number
) {
    await clickOnButton(page, 'Palets');

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
            await getByLabelAndFill(page, 'Largo (cm)', length.toString());

            await getByLabelAndFill(page, 'Ancho (cm)', width.toString());

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

export async function fillDestinationOrders(page: Page, destinationInfo: Destination) {
    if (destinationInfo.favorite) {
        // Auto filled inputs are: mail, phone, address, zipCode, population and country

        await clickOnElementById(page, 'destination');

        await clickOnText(page, destinationInfo.favorite);

        const remarkLocator = await clickOnElementById(page, 'remarks');
        await remarkLocator.fill(destinationInfo.remarks);
    } else {
    }
}
