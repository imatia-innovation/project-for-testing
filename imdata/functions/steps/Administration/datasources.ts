import { Page } from '@playwright/test';
import { baserUrl } from '../../../constants';
import assertList from '../../utils/assertList';
import { clickOnText, clickOnTextLast, clickOnTextNth } from '../../utils/clickOnText';
import { getById } from '../../utils/getById';
import { getByIdAndFill } from '../../utils/getByIdAndFill';
import { waitForTimeout } from '../../utils/waitforTimeout';

const DATASOURCES_PAGE_TEXTS = [
    'New',
    'Refresh',
    'Delete',
    //
    'Name',
    'Url',
    'Port',
    'Database name',
    'DataSource Type',
    'Datasource status',
    //'Explore'
];

const DATASOURCE_DETAILS_TEXTS = [
    'Undo',
    'Refresh',
    'New',
    'Delete',
    'Save',
    //
    'Datasource data',
    //
    'Name',
    'Database name',
    //
    'Url',
    'Port',
    //
    'Username',
    'Password',
    //
    'DataSource Type',
    'CHECK',
    //
    'Datasource status',
    'Status:',
    'Last modification:',
];

const DELETE_TEXTS = ['Confirm', 'Are you sure you want to delete the selected items?', 'Cancel', 'Ok'];

const CONNECTION_TEST_TEXTS = ['Connection Test', 'The connection has been established correctly', 'Ok'];

export async function datasourcesAssertions(page: Page) {
    await assertList(page, DATASOURCES_PAGE_TEXTS);
}

export async function datasourceDetailAssertions(page: Page) {
    await assertList(page, DATASOURCE_DETAILS_TEXTS);
}

export async function deleteAssertions(page: Page) {
    await assertList(page, DELETE_TEXTS);
}

export async function connectionTestAssertions(page: Page) {
    await assertList(page, CONNECTION_TEST_TEXTS);
}

export async function createNewDS(page: Page, datasource: Record<string, string>) {
    await clickOnTextNth(page, 'New', 1);
    await waitForTimeout(page);

    await getByIdAndFill(page, 'name', datasource.name);
    await getByIdAndFill(page, 'dbname', datasource.name);
    await getByIdAndFill(page, 'url', process.env.DATASOURCE_URL!);
    await getByIdAndFill(page, 'port', process.env.DATASOURCE_PORT!);
    await getByIdAndFill(page, 'username', process.env.DATASOURCE_USERNAME!);
    await getByIdAndFill(page, 'pass', process.env.DATASOURCE_PASS!);

    await getById(page, 'datasourceType').click();
    await waitForTimeout(page);
    await clickOnTextLast(page, process.env.DATASOURCE_DS_TYPE!);

    await clickOnText(page, 'CHECK');
    await waitForTimeout(page);

    (await connectionTestAssertions(page), await clickOnTextNth(page, 'Ok', 1));
    await waitForTimeout(page);

    await clickOnText(page, 'Ok');
    await waitForTimeout(page);

    await page.goto(baserUrl + '/app/main/datasources');
    await page.waitForURL(baserUrl + '/app/main/datasources');
    await waitForTimeout(page);
}
