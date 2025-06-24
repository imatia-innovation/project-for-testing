import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { loginAndGoToSingleViewPage } from '../../functions/steps/Analysis/singleView';
import assertByText from '../../functions/utils/assertByText';

test('should go to Analysis > DataSources page with ds admin user and make assertions', async ({ page }) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    await assertByText(page, 'No results found');
});
