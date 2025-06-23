import { Page } from '@playwright/test';
import logger from './logger';
import assertTextExcluded from './assertTextExcluded';

export default async function assertListExcluded(page: Page, list: string[]) {
    logger.info('Start assertListExcluded.ts assertList excluded', { list });
    for (let index = 0; index < list.length; index++) {
        logger.info(' assertListExcluded.ts assert text is excluded:', list[index]);
        await assertTextExcluded(page, list[index]);
    }
    logger.info('Finish assertListExcluded.ts assertList');
}
