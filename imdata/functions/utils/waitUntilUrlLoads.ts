import { expect, Page } from '@playwright/test';
import { baserUrl } from '../../constants';

export async function waitUntilUrlLoads(page: Page, url: string) {
    await page.waitForURL(baserUrl + url);
    expect(page.url()).toContain(baserUrl + url);
}
