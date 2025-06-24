import test from '@playwright/test';
import { USER_DS_ADMIN } from '../../constants';
import {
    createNewDS,
    datasourceDetailAssertions,
    datasourcesAssertions,
    deleteAssertions,
} from '../../functions/steps/Administration/datasources';
import { homeAssertions } from '../../functions/steps/home';
import { login } from '../../functions/steps/login';
import { clickOnText, clickOnTextNth } from '../../functions/utils/clickOnText';
import { getById } from '../../functions/utils/getById';
import logger from '../../functions/utils/logger';
import { waitForTimeout } from '../../functions/utils/waitforTimeout';

const datasourceLoan = {
    name: 'Loan',
};

const datasourceMortgage = {
    name: 'Mortgage',
};

const datasourceCard = {
    name: 'Card',
};

test('should go to Administration Datasources page with ds admin user', async ({ page }) => {
    await login(page, USER_DS_ADMIN);
    await homeAssertions(page, USER_DS_ADMIN);

    await getById(page, 'datasources-gridItem').click();
    await waitForTimeout(page);
    await datasourcesAssertions(page);

    let rowLocator = page.getByText('POSTGRESQL');
    let qtyRows = (await rowLocator.all()).length;

    logger.info('  1.Datasources.spec.ts qtyRows: ', qtyRows);

    for (let index = qtyRows; index > 0; index--) {
        await rowLocator.first().click();
        await waitForTimeout(page);
        await datasourceDetailAssertions(page);

        await clickOnTextNth(page, 'Delete', 1);

        await waitForTimeout(page);
        await deleteAssertions(page);
        await clickOnText(page, 'Ok');
        await waitForTimeout(page);

        rowLocator = page.getByText('POSTGRESQL');
        qtyRows = (await rowLocator.all()).length;
        logger.info('  1.Datasources.spec.ts qtyRows: ', qtyRows);
    }

    test.slow();

    await createNewDS(page, datasourceLoan);

    await createNewDS(page, datasourceMortgage);

    await createNewDS(page, datasourceCard);

    await page.waitForTimeout(5000);
});
