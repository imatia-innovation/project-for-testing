import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import { getAllEntitiesNames } from '../../constants/entitiesTestCases';
import {
    singleViewAccount,
    singleViewAddress,
    singleViewCustomer,
    singleViewTransaction,
} from '../../constants/singleViewTestCases';
import { loginAndGoToSingleViewPage } from '../../functions/steps/Analysis/singleView';
import assertByText from '../../functions/utils/assertByText';
import assertList from '../../functions/utils/assertList';
import { clickOnTextLast } from '../../functions/utils/clickOnText';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';

test.skip('should go to Analysis > DataSources page with ds admin user and make assertions without Entities created', async ({
    page,
}) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    await assertByText(page, 'No results found');
});

test('should go to Analysis > DataSources page with ds admin user and make assertions with Entities created', async ({
    page,
}) => {
    await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

    await assertList(page, ['Export Single View', ...getAllEntitiesNames()]);
});

const singleViewTestCases = [singleViewAccount, singleViewAddress, singleViewCustomer, singleViewTransaction];

singleViewTestCases.forEach((singleViewTestCase) => {
    test(`should make assertions in the ${singleViewTestCase.name} Single View`, async ({ page }) => {
        await loginAndGoToSingleViewPage(page, USER_DS_ADMIN);

        await assertList(page, ['Export Single View', ...getAllEntitiesNames()]);

        await clickOnTextLast(page, singleViewTestCase.name);
        await waitForTimeout(page);

        await assertList(page, [
            singleViewTestCase.name,
            'Find duplicates',
            //
            ...singleViewTestCase.attributes,
        ]);
    });
});
