import test from "@playwright/test";
import { baserUrl, TIMEOUT, USER_ADMIN, USER_IMATIA_ADMIN, USER_MAIN, USER_ONE } from "../constants";
import { fillLoginInputs, homeAssertions, loginPageAssertions, logout } from "../functions/steps/login";

test('should go to login Page, and make login successfully with user One and logout', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');
    await page.waitForTimeout(TIMEOUT);

    await loginPageAssertions(page);

    const user = USER_ONE;
    await fillLoginInputs(page, user);

    await homeAssertions(page, user.credentials.role);

    await logout(page);
});

test('should go to login Page, and make login successfully with user Admin and logout', async ({ page }) => {// This one fails because I don't know the password
    await page.goto(baserUrl + '/app/login');
    await page.waitForTimeout(TIMEOUT);

    await loginPageAssertions(page);

    const user = USER_ADMIN;
    await fillLoginInputs(page, user);

    await homeAssertions(page, user.credentials.role);

    await logout(page);
});

test('should go to login Page, and make login successfully with user Imatia Admin and logout', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');
    await page.waitForTimeout(TIMEOUT);

    await loginPageAssertions(page);

    const user = USER_IMATIA_ADMIN;
    await fillLoginInputs(page, user);

    await homeAssertions(page, user.credentials.role);

    await logout(page);
});