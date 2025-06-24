import { Page } from '@playwright/test';
import { TIMEOUT } from '../../constants';

export async function waitForTimeout(page: Page, extend: number = 1) {
    await page.waitForTimeout(TIMEOUT * extend);
}
