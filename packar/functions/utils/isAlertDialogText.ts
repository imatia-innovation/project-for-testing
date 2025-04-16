import { Locator, Page } from '@playwright/test';
import logger from './logger';

export default async function isAlertDialogText(page: Page, text: string): Promise<boolean> {
    logger.info('Start isAlertDialogText.ts isAlertDialogText');
    const alertLocator: Locator = page.getByRole('alertdialog');
    const count = await alertLocator.count();

    let alertExist: boolean = count > 0;

    let alertText;

    try {
        alertText = await alertLocator.textContent({
            timeout: 1000,
        });
    } catch (error) {
        alertText = '';
    }

    logger.info('  isAlertDialogText.ts isAlertDialogText', { text, alertText });

    alertExist = alertExist || Boolean(alertText?.includes(text));

    logger.info('Finish isAlertDialogText.ts isAlertDialogText', { alertExist });
    return Boolean(alertExist);
}
