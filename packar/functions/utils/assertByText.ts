import { expect, Locator, Page } from '@playwright/test';
import logger from './logger';

export default async function assertByText(page: Page, text: string): Promise<Locator> {
    logger.info('    assertByText.ts ', text);
    const locator = page.getByText(text);
    const result = await locator.count();

    expect(result).not.toBe(0);

    return locator;
}
