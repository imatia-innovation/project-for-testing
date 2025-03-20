import { expect, Page } from '@playwright/test';

export default async function assertList(page: Page, array: string[]) {
    for (let index = 0; index < array.length; index++) {
        const locator = page.getByText(array[index]);
        const result = await locator.count();
        expect(result).not.toBe(0);
    }
}
