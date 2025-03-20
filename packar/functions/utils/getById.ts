import { Locator, Page } from '@playwright/test';

export function getById(page: Page, id: string): Locator {
    return page.locator(`[id='${id}']`);
}
