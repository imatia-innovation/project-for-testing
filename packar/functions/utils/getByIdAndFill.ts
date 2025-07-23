import { expect, Page } from '@playwright/test';
import { getById } from './getById';
import logger from './logger';

export async function getByIdAndFill(page: Page, id: string, text: string) {
    logger.info('Start getByIdAndFill.ts getByIdAndFill', { id, text });
    const inputLocator = getById(page, id);
    await inputLocator.fill(text);

    const value = await inputLocator.inputValue();
    expect(value).toContain(text);
    logger.info('Finish getByIdAndFill.ts getByIdAndFill');
}
