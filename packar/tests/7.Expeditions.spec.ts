import test from '@playwright/test';
import { admin } from '../constants';
import login from '../functions/steps/login';
import { clickOnText } from '../functions/utils/clickOnText';
import assertList from '../functions/utils/assertList';
import { NEW_EXPEDITION_TEXTS } from '../functions/steps/orderTracking/createExpeditionSteps';
import { navigateToExpeditionsPage } from '../functions/steps/expeditionsSteps';

test('should go to Expeditions page and make text assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToExpeditionsPage(page);

    await clickOnText(page, 'Nueva expedición');
    await assertList(page, NEW_EXPEDITION_TEXTS);
});
