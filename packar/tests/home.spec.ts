import { test, expect } from '@playwright/test';
import { admin, demo } from '../constants';
import login from '../functions/steps/login';

const itemList = ['Envíos', 'Análisis', 'Devoluciones', 'Destinos', 'Expediciones', 'Informes', 'Reglas'];

test.afterEach(async ({ page }) => {
    page.close();
});

test('should make login with admin user and see the Home page 7 content cards', async ({ page }) => {
    await login(page, admin);

    for (let index = 0; index < itemList.length; index++) {
        const locator = page.getByText(itemList[index]);
        expect(await locator.count()).toEqual(2);

        const firstElement = await locator.first().innerHTML();
        expect(firstElement).toContain('<mat-icon');
        expect(firstElement).toContain('class="button-icon');

        const lastElement = await locator.last().innerHTML();
        expect(itemList.some((item) => item.includes(lastElement))).toBeTruthy();
    }
});

test('should make login with demo user and see the Home page 7 content cards', async ({ page }) => {
    await login(page, demo);

    for (let index = 0; index < itemList.length; index++) {
        const locator = page.getByText(itemList[index]);
        expect(await locator.count()).toEqual(2);

        const firstElement = await locator.first().innerHTML();
        expect(firstElement).toContain('<mat-icon');
        expect(firstElement).toContain('class="button-icon');

        const lastElement = await locator.last().innerHTML();
        expect(itemList.some((item) => item.includes(lastElement))).toBeTruthy();
    }
});
