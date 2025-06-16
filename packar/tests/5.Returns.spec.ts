import test from '@playwright/test';
import { admin } from '../constants';
import login from '../functions/steps/login';
import { navigateToReturnsPage } from '../functions/steps/returnsSteps';

test('should go to Returns page and make text assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToReturnsPage(page);
});
