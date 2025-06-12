import { expect, Locator, Page } from '@playwright/test';
import logger from './logger';

export async function assertTextInRow(page: Page, reference: string, text: string) {
    logger.info('Start assertTextInRow, text: ', text);
    const { rowText } = await locateRow(page, reference);

    expect(rowText).not.toBeUndefined();
    expect(rowText!.includes(text)).toBeTruthy();
    logger.info('Finish assertTextInRow');
}

export async function locateRow(page: Page, reference: string) {
    const rowsLocators: Locator = page.getByRole('row');

    const rowsLocatorsArray: Locator[] = await rowsLocators.all();

    let rows = [];

    for (let index = 0; index < rowsLocatorsArray.length; index++) {
        const rowLocator: Locator = rowsLocatorsArray[index];

        const innerText: null | string = await rowLocator.innerText();

        if (innerText) {
            const rowTexts: string[] = innerText.replace(/\t\n/g, '').split(/\n/g);
            const rowText: string = rowTexts.join(',');
            rows.push(rowText);
        }
    }

    let index = 0;
    const row = rows.find((row, i) => {
        index = i;
        return row.includes(reference);
    });

    return { rowsLocators, index, rowLocator: rowsLocators.nth(index), rowText: row };
}
