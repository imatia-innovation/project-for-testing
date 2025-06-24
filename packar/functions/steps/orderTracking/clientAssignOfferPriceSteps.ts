import { Page } from '@playwright/test';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import OfferOpenPriceTest from '../../../interfaces/OfferOpenPriceTest';
import { assertTextInRow } from '../../utils/assertTextInRow';
import logger from '../../utils/logger';
import { waitForTimeout } from '../../utils/waitforTimeout';
import logout from '../logout';
import { createNewOrder } from '../ordersSteps';
import { getOrderId } from './courierAcceptRejectOfferSteps';

export async function createOrderOpenPricingAndGetOrderId(
    page: Page,
    offerTest: OfferOpenPriceTest,
    testIndex: number,
    isOpenPricing: boolean
): Promise<string> {
    const reference: string = await createNewOrder(page, offerTest, testIndex);

    await waitForTimeout(page);

    await assertTextInRow(page, reference, isOpenPricing ? ORDER_STATUS.PENDING_PRICING : ORDER_STATUS.PENDING_ACCEPT);
    const orderId = await getOrderId(page, reference);
    await logout(page);

    logger.info(`clientAssignOfferPriceSteps.ts createOrderAndGoToOfferDetailPage orderId: ${orderId}`);

    await waitForTimeout(page);

    return orderId;
}
