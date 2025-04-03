import { Locator, Page } from '@playwright/test';
import { getById } from './getById';

export async function clickOnText(page: Page, text: string): Promise<Locator> {
    const locator: Locator = page.getByText(text);
    await locator.first().click();
    return locator;
}

export async function clickOnElementById(page: Page, id: string): Promise<Locator> {
    const locator: Locator = getById(page, id);
    await locator.click();
    return locator;
}

export async function locateTheButtonIndex(page: Page, text: string) {
    const buttonLocators = page.getByRole('button');

    const buttonLocatorsText: string[] = await buttonLocators.allTextContents();

    let indexes: number[] = [];

    for (let i = 0; i < buttonLocatorsText.length; i++) {
        const buttonLocator = buttonLocatorsText[i];

        if (text === buttonLocator) {
            indexes.push(i);
        }
    }

    //console.log("locateTheButtonIndex", {text, buttonLocatorsText, indexes})

    return { indexes, buttonLocators };
}

export async function clickOnButton(page: Page, text: string, n: number = 0): Promise<Locator> {
    const { indexes, buttonLocators } = await locateTheButtonIndex(page, text);

    let buttonLocator = indexes.length === 1 ? buttonLocators.nth(indexes[0]) : buttonLocators.nth(indexes[n]);

    await buttonLocator.click();

    return buttonLocators;
}
