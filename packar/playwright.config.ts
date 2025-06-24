import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: 0,
    workers: 1,
    reporter: 'line',
    use: {
        trace: 'on-first-retry',
        viewport: { width: 1850, height: 900 },
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
