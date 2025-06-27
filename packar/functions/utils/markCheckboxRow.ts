import { Page } from '@playwright/test';
//import logger from "./logger";
import { locateRow } from './assertTextInRow';

export async function markCheckboxRow(page: Page, text: string) {
    const { rowLocator } = await locateRow(page, text);

    const checkboxLocator = rowLocator.getByRole('checkbox');
    // const checkboxLocators = await checkboxLocator.all();
    // const checkboxQty = checkboxLocators.length;
    // logger.info(' markCheckboxRow.ts checkboxQty', checkboxQty)
    await checkboxLocator.first().check();
}
