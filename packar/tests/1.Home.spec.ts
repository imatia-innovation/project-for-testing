import { test, expect } from '@playwright/test';
import { admin, demo, courier } from '../constants';
import login from '../functions/steps/login';
import logger from '../functions/utils/logger';

const ITEM_LIST_ADMIN = [
    'Envíos',
    'Análisis',
    'Devoluciones',
    'Destinos',
    'Expediciones',
    'Mis expediciones',
    'Informes',
    'Reglas',
];

const ITEM_LIST_DEMO = ['Envíos', 'Análisis', 'Devoluciones', 'Destinos', 'Expediciones', 'Informes', 'Reglas'];

const ITEM_LIST_COURIER = ['Mis expediciones'];

test.afterEach(async ({ page }) => {
    page.close();
});

test(`should make login with admin user and see the Home page ${ITEM_LIST_ADMIN.length} content cards`, async ({
    page,
}) => {
    await login(page, admin);

    for (let index = 0; index < ITEM_LIST_ADMIN.length; index++) {
        const locator = page.getByText(ITEM_LIST_ADMIN[index]);

        const count = await locator.count();

        logger.info(`1.Home.spec.ts validating count of: ${ITEM_LIST_ADMIN[index]} in the Home page is: ${count}`);

        if (ITEM_LIST_ADMIN[index].includes('Expediciones')) {
            expect(count).toEqual(4);
        } else {
            expect(count).toEqual(2);
        }

        const lastElement = await locator.last().innerHTML();
        expect(ITEM_LIST_ADMIN.some((item) => item.includes(lastElement))).toBeTruthy();
    }
});

test(`should make login with demo user and see the Home page ${ITEM_LIST_DEMO.length} content cards`, async ({
    page,
}) => {
    await login(page, demo);

    for (let index = 0; index < ITEM_LIST_DEMO.length; index++) {
        const locator = page.getByText(ITEM_LIST_DEMO[index]);

        const count = await locator.count();

        logger.info(`1.Home.spec.ts validating count of: ${ITEM_LIST_DEMO[index]} in the Home page is: ${count}`);

        expect(count).toEqual(2);

        const lastElement = await locator.last().innerHTML();
        expect(ITEM_LIST_DEMO.some((item) => item.includes(lastElement))).toBeTruthy();
    }
});

test(`should make login with courier user and see the Home page ${ITEM_LIST_COURIER.length} content cards`, async ({
    page,
}) => {
    await login(page, courier);

    for (let index = 0; index < ITEM_LIST_COURIER.length; index++) {
        const locator = page.getByText(ITEM_LIST_COURIER[index]);

        const count = await locator.count();

        logger.info(`1.Home.spec.ts validating count of: ${ITEM_LIST_COURIER[index]} in the Home page is: ${count}`);

        expect(count).toEqual(2);

        const lastElement = await locator.last().innerHTML();
        expect(ITEM_LIST_COURIER.some((item) => item.includes(lastElement))).toBeTruthy();
    }
});
