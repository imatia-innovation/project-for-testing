import { expect, Locator, Page } from '@playwright/test';

export default async function assertTextExcluded(page: Page, text: string): Promise<Locator> {
    const locator = page.getByText(text);
    const result = await locator.count();

    expect(result).toBe(0);

    return locator;
}
