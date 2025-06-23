import { Locator, Page } from '@playwright/test';
import logger from './logger';

export async function getEnabledButtonsByText(page: Page, text: string): Promise<Locator[]> {
    logger.info('  Start getEnabledButton.ts getEnabledButtonsByText: ', text);
    const locatorByText = page.getByText(text);
    const locatorsByText = await locatorByText.all();

    let result: Locator[] = [];

    for (let index = 0; index < locatorsByText.length; index++) {
        const locatorElement = locatorsByText[index];

        const innertText = await locatorElement.innerText();
        const isEnabled = await locatorElement.isEnabled();

        if (isEnabled) {
            logger.info('  getEnabledButton.ts locatorElement info: ', index, innertText);
            result.push(locatorElement);
        }
    }

    logger.info('  Finish getEnabledButton.ts getEnabledButtonsByText: ', text);

    return result;
}

export async function getEnabledButtonExcludingText(
    locators: Locator[],
    excludeText: string
): Promise<Locator | undefined> {
    logger.info('  Start getEnabledButton.ts getEnabledButtonExcludingText: ', excludeText);
    for (let index = 0; index < locators.length; index++) {
        const locator: Locator = locators[index];
        const innertText = await locator.innerText();
        if (!innertText.includes(excludeText)) {
            logger.info('  Finish getEnabledButton.ts getEnabledButtonExcludingText: found a locator');
            return locator;
        }
    }
    logger.info('  Finish getEnabledButton.ts getEnabledButtonExcludingText: found nothing');
}
