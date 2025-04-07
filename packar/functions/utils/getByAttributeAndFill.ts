import { expect, Page } from '@playwright/test';
import { getByAttribute } from './getByAttribute';

export async function getByAttributeAndFill(page: Page, attribute: string, attrValue: string, text: string) {
    const inputLocator = getByAttribute(page, attribute, attrValue);
    await inputLocator.fill(text);

    const inputValue = await inputLocator.inputValue();
    expect(inputValue).toEqual(text);
}
