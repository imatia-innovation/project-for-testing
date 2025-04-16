import { Locator, Page } from '@playwright/test';
import { getById } from './getById';
import logger from './logger';

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
    logger.info('Start clickOnText.ts locateTheButtonIndex', { text });
    const buttonLocators = page.getByRole('button');

    const buttonLocatorsText: string[] = await buttonLocators.allTextContents();

    let indexes: number[] = [];

    for (let i = 0; i < buttonLocatorsText.length; i++) {
        const buttonLocator = buttonLocatorsText[i];

        if (text === buttonLocator) {
            indexes.push(i);
        }
    }

    logger.info('Finish clickOnText.ts locateTheButtonIndex', { text, buttonLocatorsText, indexes });
    return { indexes, buttonLocators };
}

export async function clickOnButton(page: Page, text: string, n: number = 0): Promise<Locator> {
    logger.info('Start clickOnText.ts clickOnButton', { text, n });
    const { indexes, buttonLocators } = await locateTheButtonIndex(page, text);

    logger.info('  clickOnText.ts clickOnButton', { indexes });

    let buttonLocator = indexes.length === 1 ? buttonLocators.nth(indexes[0]) : buttonLocators.nth(indexes[n]);

    await buttonLocator.click();

    logger.info('Finish clickOnText.ts clickOnButton');
    return buttonLocators;
}
