import { Page } from '@playwright/test';
import assertByText from './assertByText';
import logger from './logger';

export default async function assertList(page: Page, list: string[]) {
    logger.info('Start assertList.ts assertList', { list });
    for (let index = 0; index < list.length; index++) {
        logger.info(' assertList.ts assertList', list[index]);
        await assertByText(page, list[index]);
    }
    logger.info('Start assertList.ts assertList');
}
