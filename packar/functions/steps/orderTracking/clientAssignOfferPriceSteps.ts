import { Page } from '@playwright/test';
import logger from '../../utils/logger';
import { createNewOrder } from '../ordersSteps';
import { getOrderId } from './courierAcceptRejectOfferSteps';
import OfferOpenPriceTest from '../../../interfaces/OfferOpenPriceTest';
import { TIMEOUT } from '../../../constants';
import logout from '../logout';
import { assertTextInRow } from '../../utils/assertTextInRow';
import { ORDER_STATUS } from '../../../constants/orderStatus';

export async function createOrderOpenPricingAndGetOrderId(
    page: Page,
    offerTest: OfferOpenPriceTest,
    testIndex: number,
    isOpenPricing: boolean
): Promise<string> {
    const reference: string = await createNewOrder(page, offerTest, testIndex);

    await page.waitForTimeout(TIMEOUT);

    await assertTextInRow(page, reference, isOpenPricing ? ORDER_STATUS.PENDING_PRICING : ORDER_STATUS.PENDING_ACCEPT);
    const orderId = await getOrderId(page, reference);
    await logout(page);

    logger.info(`courierAcceptRejectOfferSteps.spec.ts createOrderAndGoToOfferDetailPage orderId: ${orderId}`);

    await page.waitForTimeout(TIMEOUT);

    return orderId;
}
