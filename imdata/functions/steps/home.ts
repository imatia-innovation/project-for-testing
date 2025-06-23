import { Page } from '@playwright/test';
import logger from '../utils/logger';
import { ROLES } from '../../constants/roles';
import assertListExcluded from '../utils/assertListExcluded';
import assertList from '../utils/assertList';
import User from '../../interfaces/User';
import assertByText from '../utils/assertByText';

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
    'Users Datasources',
    'Transformation Rules',
    'Validation Rules',
];

const HOME_TEXTS_DS_ADMIN = [
    'Home',
    'Administration',
    'Analysis',
    'Transformation Rules',
    'Validation Rules',
    'Logout',
    //
    'DataSources',
    'Users',
    'Groups',
    'Attributes',
    'Entities',
    'Single View',
    'Users Datasources',
    'Transformation Rules',
    'Validation Rules',
];

const HOME_TEXTS_DS_ADMIN_EXCLUDES = ['Imatia administration', 'User Datasources', 'Roles'];

const HOME_TEXTS_USER = [
    'Home',
    'Analysis',
    'Transformation Rules',
    'Validation Rules',
    'Logout',
    //
    'Attributes',
    'Entities',
    'Single View',
    'Users Datasources',
    'Transformation Rules',
    'Validation Rules',
];

const HOME_TEXTS_USER_EXCLUDES = [
    'Administration',
    'Imatia administration',
    //
    'Roles',
    'User Datasources',
    'Groups',
];

export async function homeAssertions(page: Page, user: User) {
    logger.info('Start home.ts homeAssertions userRole: ', user.credentials.role);
    switch (user.credentials.role) {
        case ROLES.ADMINISTRATOR_IMATIA:
            await assertList(page, HOME_TEXTS_IMATIA_ADMIN);
            break;
        case ROLES.ADMINISTRATOR_DS:
            await assertList(page, HOME_TEXTS_DS_ADMIN);
            await assertListExcluded(page, HOME_TEXTS_DS_ADMIN_EXCLUDES);
            break;
        case ROLES.REGULAR_USER:
            await assertList(page, HOME_TEXTS_USER);
            await assertListExcluded(page, HOME_TEXTS_USER_EXCLUDES);
            break;
        default:
            break;
    }

    await assertByText(page, user.displayName);

    logger.info('Finish home.ts homeAssertions');
}
