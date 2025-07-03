import CreateNewOrderTest from './CreateNewOrderTest';
import CreateNewRuleOrderTest from './CreateNewRuleOrderTest';
import User from './User';

export interface CourierResponseOffer {
    courier: User;
    sendResponse: string;
    hasFixedPrice: boolean;
    setPrice?: string;
    expectedRowValues?: Record<string, string>;
}

export default interface AccRejAssignByRulesTest extends CreateNewOrderTest {
    relatedRule: CreateNewRuleOrderTest;
    couriersResponses: CourierResponseOffer[];
    expectedRowValues?: Record<string, string>;
}
