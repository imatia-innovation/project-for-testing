import { Page } from '@playwright/test';
import { baserUrl, TIMEOUT } from '../../constants';
import User from '../../interfaces/User';
import { getById } from '../utils/getById';
import assertList from '../utils/assertList';
import { clickOnText, clickOnTextNth } from '../utils/clickOnText';
import { getByIdAndFill } from '../utils/getByIdAndFill';
import assertListExcluded from '../utils/assertListExcluded';
import logger from '../utils/logger';
import { ROLES } from '../../constants/roles';

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

const HOME_TEXTS_IMATIA_ADMIN = [
    'Home',
    'Administration',
    'Imatia administration',
    'Analysis',
    'Transformation Rules',
    'Validation Rules',
    'Logout',
    //
    'DataSources',
    'Users',
    'Groups',
    'Roles',
    'Attributes',
    'Entities',
    'Single View',
    'User Datasources',
    'Transformation Rules',
    'Validation Rules'
];

const HOME_TEXTS_ADMIN = [
    'Home',
    'Administration',
    'Imatia administration',
    'Analysis',
    'Transformation Rules',
    'Validation Rules',
    'Logout',
    //
    'DataSources',
    'Users',
    'Groups',
    'Roles',
    'Attributes',
    'Entities',
    'Single View',
    'Transformation Rules',
    'Validation Rules'
];

const HOME_TEXTS_ADMIN_EXCLUDES = [
    'User Datasources',
];

const HOME_TEXTS_USER = [
'Home',
    'Administration',
    'Imatia administration',
    'Analysis',
    'Transformation Rules',
    'Validation Rules',
    'Logout',
    //
    'DataSources',
    'Users',
    'Groups',
    'Roles',
    'Attributes',
    'Entities',
    'Single View',
    'Transformation Rules',
    'Validation Rules'
];

const HOME_TEXTS_USER_EXCLUDES = [
    'User Datasources'
];

const LOGOUT_TEXTS = [
    'Confirm',
    'Are you sure you want to leave?',
    'Ok',
    'Cancel'
]

export default async function login(page: Page, user: User) {
    await page.goto(baserUrl + '/app/login');

    await fillLoginInputs(page, user);
}

export async function fillLoginInputs(page: Page, user: User) {
    logger.info('Start login.ts fillLoginInputs user: ', {
        email: user.credentials.email,
        role: user.credentials.role,
        tenants: user.tenants,
        mainTenant: user.mainTenant
    });
    const userSelector = getById(page, 'username');
    await userSelector.click();
    await userSelector.fill(user.credentials.email);

    await page.waitForTimeout(TIMEOUT);

    const organizationSelector = getById(page, 'tenant');
    await organizationSelector.click();
    await organizationSelector.click();

    await page.waitForTimeout(TIMEOUT);

    await assertUserTenants(page, user);

    await clickOnTextNth(page, user.mainTenant, 0);

    await clickOnText(page, 'Login');

    await page.waitForTimeout(TIMEOUT);

    await loginPageAssertions2(page, user);

    await getByIdAndFill(page, 'password', user.credentials.pass);

    await clickOnText(page, 'Next');

    await page.waitForTimeout(TIMEOUT);
    logger.info('Finish login.ts fillLoginInputs ')
}

export async function loginPageAssertions2(page: Page, user: User) {
    await assertList(page, [...LOGIN_TEXTS_2, user.credentials.email]);
}

export async function loginPageAssertions(page: Page) {
    await assertList(page, LOGIN_TEXTS);
}

async function assertUserTenants(page: Page, user: User) {
    const tenants = user.tenants.map(t=>(t.name));
    await assertList(page, tenants);
}


export async function homeAssertions(page: Page, userRole: string) {
    logger.info('Start login.ts homeAssertions userRole: ', userRole);
    switch (userRole) {
        case  ROLES.ADMINISTRATOR_DS:
            await assertList(page, HOME_TEXTS_IMATIA_ADMIN);
            break;
        case  ROLES.ADMINISTRATOR_IMATIA:
            await assertList(page, HOME_TEXTS_ADMIN);
            await assertListExcluded(page, HOME_TEXTS_ADMIN_EXCLUDES);
            break;
        case ROLES.REGULAR_USER:
            await assertList(page, HOME_TEXTS_USER);
            await assertListExcluded(page, HOME_TEXTS_USER_EXCLUDES);
            break;
        default:
            break;
    }
    logger.info('Finish login.ts homeAssertions');
}

async function logoutAssertions(page: Page) {
    await assertList(page, LOGOUT_TEXTS);
}

export async function logout(page: Page) {
    await clickOnText(page, 'Logout');

    await logoutAssertions(page);

    await clickOnText(page, 'Ok');

    await page.waitForTimeout(TIMEOUT);

    await loginPageAssertions(page);
}
