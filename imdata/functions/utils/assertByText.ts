import { expect, Locator, Page } from '@playwright/test';

export default async function assertByText(page: Page, text: string): Promise<Locator> {
    const locator = page.getByText(text);
    const result = await locator.count();

    expect(result).not.toBe(0);

    return locator;
}
