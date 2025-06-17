import test from '@playwright/test';
import { admin, courierFixedPrice } from '../constants';
import login from '../functions/steps/login';
import {
    assertMyExpeditionsPage,
    assertMyExpeditionsPageError,
    navigateToMyExpeditionsPage,
} from '../functions/steps/myExpeditionsSteps';

test('should go to My Expeditions page as admin and make text error assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToMyExpeditionsPage(page);

    await assertMyExpeditionsPageError(page);
});

test('should go to My Expeditions page as courierFixedPrice and make text assertions', async ({ page }) => {
    await login(page, courierFixedPrice);

    await navigateToMyExpeditionsPage(page);

    await assertMyExpeditionsPage(page);
});
