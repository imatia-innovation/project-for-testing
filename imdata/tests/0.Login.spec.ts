import test from '@playwright/test';
import { USER_DS_ADMIN, USER_IMATIA_ADMIN, USER_ONE } from '../constants';
import { login, logout } from '../functions/steps/login';
import { prepareTestDescriptions } from '../functions/utils/prepareTestDescriptions';

const loginTests = [
    {
        testDescription:
            'should go to login Page, and make login successfully with user: "{{username}}" role: {{role}} and logout',
        user: USER_ONE,
    },
    {
        testDescription:
            'should go to login Page, and make login successfully with user: "{{username}}" role: {{role}} and logout',
        user: USER_DS_ADMIN,
    },
    {
        testDescription:
            'should go to login Page, and make login successfully with user: "{{username}}" role: {{role}} and logout',
        user: USER_IMATIA_ADMIN,
    },
];

loginTests.forEach((testCase) => {
    const testDescription = prepareTestDescriptions(testCase);
    const user = testCase.user;

    test(testDescription, async ({ page }) => {
        await login(page, user);

        await logout(page);
    });
});
