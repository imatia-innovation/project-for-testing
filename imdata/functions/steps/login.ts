import { Page } from '@playwright/test';
import { baserUrl } from '../../constants';
import User from '../../interfaces/User';
import assertList from '../utils/assertList';
import { clickOnText, clickOnTextNth } from '../utils/clickOnText';
import { getById } from '../utils/getById';
import { getByIdAndFill } from '../utils/getByIdAndFill';
import logger from '../utils/logger';
import { waitForTimeout } from '../utils/waitforTimeout';

const LOGIN_TEXTS: string[] = [
    'Log in to your account:',
    'Select your organization', // Bug in spanish
    'Login',
    //
    'Developed by Imatia Innovation',
    '©',
    '2021',
    'All rights reserved',
];

const LOGIN_TEXTS_2: string[] = [
    'Enter your account:',
    'I forgot my password',
    'Back',
    'Next',
    //
    'Developed by Imatia Innovation',
    '©',
    '2021',
    'All rights reserved',
];

const LOGOUT_TEXTS = ['Confirm', 'Are you sure you want to leave?', 'Ok', 'Cancel'];

export async function fillLoginInputs(page: Page, user: User) {
    logger.info('Start login.ts fillLoginInputs user: ', {
        email: user.credentials.email,
        role: user.credentials.role,
        tenants: user.tenants,
        mainTenant: user.mainTenant,
    });
    const userSelector = getById(page, 'username');
    await userSelector.click();
    await userSelector.fill(user.credentials.email);

    await waitForTimeout(page);

    const organizationSelector = getById(page, 'tenant');
    await organizationSelector.click();
    await organizationSelector.click();

    await waitForTimeout(page);

    await assertUserTenants(page, user);

    await clickOnTextNth(page, user.mainTenant, 0);

    await clickOnText(page, 'Login');

    await waitForTimeout(page);

    await loginPageAssertions2(page, user);

    await getByIdAndFill(page, 'password', user.credentials.pass);

    await clickOnText(page, 'Next');

    await waitForTimeout(page);
    logger.info('Finish login.ts fillLoginInputs ');
}

export async function loginPageAssertions2(page: Page, user: User) {
    await assertList(page, [...LOGIN_TEXTS_2, user.credentials.email]);
}

export async function loginPageAssertions(page: Page) {
    await assertList(page, LOGIN_TEXTS);
}

async function assertUserTenants(page: Page, user: User) {
    const tenants = user.tenants.map((t) => t.name);
    await assertList(page, tenants);
}

async function logoutAssertions(page: Page) {
    await assertList(page, LOGOUT_TEXTS);
}

export async function logout(page: Page) {
    await clickOnText(page, 'Logout');

    await logoutAssertions(page);

    await clickOnText(page, 'Ok');

    await waitForTimeout(page);

    await loginPageAssertions(page);
}

export async function login(page: Page, user: User) {
    await page.goto(baserUrl + '/app/login');
    await waitForTimeout(page);

    await loginPageAssertions(page);

    await fillLoginInputs(page, user);
}
