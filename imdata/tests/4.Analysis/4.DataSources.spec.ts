import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { DB_NAMES } from '../../constants/dbNames';
import { dataSourceDetailAssertions, loginAndGoToDataSourcesPage } from '../../functions/steps/Analysis/dataSources';
import { clickOnTextNth } from '../../functions/utils/clickOnText';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';

test('should go to Analysis > Single View page with ds admin user and make assertions', async ({ page }) => {
    await loginAndGoToDataSourcesPage(page, USER_DS_ADMIN);
});

DB_NAMES.forEach((db, index) => {
    test(`should go Single View detail page and make assertions on datasource ${db.name}`, async ({ page }) => {
        await loginAndGoToDataSourcesPage(page, USER_DS_ADMIN);

        await clickOnTextNth(page, 'Explore', index);
        await waitForTimeout(page);

        await dataSourceDetailAssertions(page, db);
    });
});
