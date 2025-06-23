import { Page } from '@playwright/test';

export async function selectRegisterPerPage(page: Page) {
    const paginationSelectOption = page.getByRole('combobox');
    await paginationSelectOption.click();

    const optionLast = page.getByRole('option').last();
    await optionLast.click();
}
