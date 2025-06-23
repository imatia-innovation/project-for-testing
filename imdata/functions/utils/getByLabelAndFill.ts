import { expect, Page } from '@playwright/test';

export async function getByLabelAndFill(
    page: Page,
    label: string,
    text: string,
    useDecimals: boolean = false,
    decimals: string = ',00'
) {
    const inputLocator = page.getByLabel(label);
    await inputLocator.fill(text);

    const value = await inputLocator.inputValue();
    useDecimals ? expect(value).toEqual(text + decimals) : expect(value).toEqual(text);
}
