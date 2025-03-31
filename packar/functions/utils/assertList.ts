import { Page } from '@playwright/test';
import assertByText from './assertByText';

export default async function assertList(page: Page, array: string[]) {
    for (let index = 0; index < array.length; index++) {
        await assertByText(page, array[index]);
    }
}
