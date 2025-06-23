import { Locator, Page } from '@playwright/test';

export function getByAttribute(page: Page, attribute: string, value: string): Locator {
    return page.locator(`[${attribute}='${value}']`);
}
