import test from '@playwright/test';
import { admin } from '../constants';
import { navigateToExpeditionsPage } from '../functions/steps/expeditionsSteps';
import login from '../functions/steps/login';
import { NEW_EXPEDITION_TEXTS } from '../functions/steps/orderTracking/createExpeditionSteps';
import assertList from '../functions/utils/assertList';
import { clickOnText } from '../functions/utils/clickOnText';

test('should go to Expeditions page and make text assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToExpeditionsPage(page);

    await clickOnText(page, 'Nueva expedición');
    await assertList(page, NEW_EXPEDITION_TEXTS);
});
