import { expect, Page } from '@playwright/test';

export async function getByLabelAndFill(page: Page, label: string, text: string) {
    const inputLocator = page.getByLabel(label);
    await inputLocator.fill(text);

    const value = await inputLocator.inputValue();
    expect(value).toEqual(text);
}
