import test from '@playwright/test';
import { navigateToAnalyticsPage } from '../functions/steps/analyticsSteps';

test('should go to Analytics page and make text assertions', async ({ page }) => {
    await navigateToAnalyticsPage(page);
});
