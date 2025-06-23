import test from '@playwright/test';
import { USER_DS_ADMIN, USER_IMATIA_ADMIN, USER_ONE } from '../constants';
import { login, logout } from '../functions/steps/login';
import { homeAssertions } from '../functions/steps/home';

const homeTests = [
    {
        testDescription:
            'should go to login Page, and make login successfully with user: "{{username}}" role: {{role}}, make Home assertions and logout',
        user: USER_ONE,
    },
    {
        testDescription:
            'should go to login Page, and make login successfully with user: "{{username}}" role: {{role}}, make Home assertions and logout',
        user: USER_DS_ADMIN,
    },
    {
        testDescription:
            'should go to login Page, and make login successfully with user: "{{username}}" role: {{role}}, make Home assertions and logout',
        user: USER_IMATIA_ADMIN,
    },
];

homeTests.forEach((testCase) => {
    const user = testCase.user;

    const testDescription = testCase.testDescription
        .replace('{{username}}', user.credentials.email)
        .replace('{{role}}', user.credentials.role);

    test(testDescription, async ({ page }) => {
        await login(page, user);

        await homeAssertions(page, user);

        await logout(page);
    });
});
