import { Locator, Page } from '@playwright/test';

export default async function isAlertDialogText(page: Page, text: string): Promise<boolean> {
    const alertLocator: Locator = page.getByRole('alertdialog');
    const count = await alertLocator.count();

    let alertExist: boolean = count > 0;

    let alertText;

    try {
        alertText = await alertLocator.textContent({
            timeout: 1000,
        });
    } catch (error) {
        alertText = '';
    }

    alertExist = alertExist || Boolean(alertText?.includes(text));

    return Boolean(alertExist);
}
