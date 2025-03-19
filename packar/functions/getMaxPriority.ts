import { Locator, Page } from '@playwright/test';

function getId(text: string): string {
    const match = text.trim().match(/^(\d+)/);
    return match ? match[1] : '';
}

function getMaxId(ids: string[]): string {
    const numbers: number[] = ids.map((id) => Number(id));
    const max: number = Math.max(...numbers);
    return max.toString();
}

export default async function getMaxPriority(page: Page): Promise<string> {
    const result: Locator[] = await page.getByRole('row').all();

    let ids = [''];
    for (let index = 0; index < result.length; index++) {
        const element: Locator = result[index];

        const textContent: null | string = await element.textContent();

        if (textContent) {
            const id: string | undefined = getId(textContent.trim());

            ids.push(id);
        }
    }

    return getMaxId(ids);
}
