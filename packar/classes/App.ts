import { Page } from '@playwright/test';
import { chromium } from 'playwright'; 

export default class App {

    browser = chromium.launch();

    page: Page | undefined = undefined;

    async open () {
        const browser = await this.browser;
        const context = await browser.newContext();
        this.page = await context.newPage();
        return this.page;
    };

    close(){
        return this.page?.close();
    }

}