import { expect, Page } from '@playwright/test';
import { getById } from './getById';

export async function getByIdAndFill(page: Page, id: string, text: string) {
    const inputLocator = getById(page, id);
    await inputLocator.fill(text);

    const value = await inputLocator.inputValue();
    expect(value).toEqual(text);
}
