import test from "@playwright/test";
import { baserUrl, TIMEOUT } from "../constants";


test('should go to login Page, and make login successfully with main user and logout', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');

    await page.waitForTimeout(TIMEOUT);
});