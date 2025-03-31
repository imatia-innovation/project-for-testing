import { expect, Page } from '@playwright/test';

export default async function assertByText(page: Page, text: string) {
    const locator = page.getByText(text);
    const result = await locator.count();
    expect(result).not.toBe(0);
}
