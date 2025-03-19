import { expect, Page } from '@playwright/test';

export default function assertElementsByText(page: Page, array: string[]) {
    for (let index = 0; index < array.length; index++) {
        const locator = page.getByText(array[index]);
        expect(locator).not.toBeNull();
    }
}
