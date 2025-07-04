import { Page } from '@playwright/test';
import { clickOnElementById, clickOnText } from '../utils/clickOnText';

export default async function logout(page: Page): Promise<void> {
    await clickOnElementById(page, 'logout');
    await clickOnText(page, 'Ok');
}
