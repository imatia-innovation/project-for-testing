import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'line',
    use: {
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'Chrome web',
            use: {
                browserName: 'chromium',
                launchOptions: {
                    headless: false,
                    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                },
            },
        },
    ],
});
