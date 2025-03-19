import { Locator, Page } from '@playwright/test';

export default async function alertdialogExist(page: Page, text: string): Promise<boolean> {
    const alertLocator: Locator = page.getByRole('alertdialog');

    let alertExist = Boolean(await alertLocator.count());

    let alertText;

    try {
        alertText = await alertLocator.textContent({
            timeout: 100,
        });
    } catch (error) {
        alertText = '';
    }

    alertExist = alertExist || Boolean(alertText?.includes(text));

    return Boolean(alertExist);
}
