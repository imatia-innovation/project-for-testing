import { Page } from '@playwright/test';
import logger from '../../utils/logger';
import { createNewOrder } from '../ordersSteps';
import { getOrderId } from './courierAcceptRejectOfferSteps';
import OfferOpenPriceTest from '../../../interfaces/OfferOpenPriceTest';
import { TIMEOUT } from '../../../constants';

export async function createOrderOpenPricingAndGetOrderId(
    page: Page,
    offerTest: OfferOpenPriceTest,
    testIndex: number,
    isOpenPricing: boolean
): Promise<string> {
    const reference: string = await createNewOrder(page, offerTest, testIndex);

    await page.waitForTimeout(TIMEOUT);

    const orderId = await getOrderId(page, reference, isOpenPricing);

    logger.info(`courierAcceptRejectOfferSteps.spec.ts createOrderAndGoToOfferDetailPage orderId: ${orderId}`);

    await page.waitForTimeout(TIMEOUT);

    return orderId;
}
