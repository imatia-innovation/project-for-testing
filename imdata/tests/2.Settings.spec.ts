import test from '@playwright/test';
import { USER_DS_ADMIN, USER_IMATIA_ADMIN, USER_ONE } from '../constants';
import { homeAssertions } from '../functions/steps/home';
import { login, logout } from '../functions/steps/login';
import { settingsAssertions } from '../functions/steps/settings';
import { clickOnText } from '../functions/utils/clickOnText';
import { getById } from '../functions/utils/getById';
import { waitForTimeout } from '../functions/utils/waitforTimeout';

const settingsTests = [
    {
        testDescription: 'should assert default settings for user: "{{username}}" role: {{role}}',
        user: USER_ONE,
    },
    {
        testDescription: 'should assert default settings for user: "{{username}}" role: {{role}}',
        user: USER_DS_ADMIN,
    },
    {
        testDescription: 'should assert default settings for user: "{{username}}" role: {{role}}',
        user: USER_IMATIA_ADMIN,
    },
];

settingsTests.forEach((testCase) => {
    const user = testCase.user;

    const testDescription = testCase.testDescription
        .replace('{{username}}', user.credentials.email)
        .replace('{{role}}', user.credentials.role);

    test(testDescription, async ({ page }) => {
        await login(page, user);

        await homeAssertions(page, user);

        await clickOnText(page, user.displayName);
        await getById(page, 'menu-settings').click();

        await settingsAssertions(page);

        const radioLocators = page.getByRole('radio');
        await radioLocators.nth(0).click();

        await waitForTimeout(page);

        await settingsAssertions(page, 'es');

        const switchLocators = page.getByRole('switch');
        await switchLocators.nth(0).click();

        await radioLocators.nth(1).click();
        await settingsAssertions(page, 'en');

        await waitForTimeout(page);

        await logout(page);
    });
});
