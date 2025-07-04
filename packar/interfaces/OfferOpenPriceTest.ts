import CreateNewOrderTest from './CreateNewOrderTest';
import User from './User';

export interface OfferOpenPriceTestCourier {
    courier: User;
    courierHasFixedPrice?: boolean;
    setPrice?: string;
}

export default interface OfferOpenPriceTest extends CreateNewOrderTest {
    couriersTest: OfferOpenPriceTestCourier[];
    assignButtonIndex: number;
}
