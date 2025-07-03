import CreateNewOrderTest from './CreateNewOrderTest';
import User from './User';

export interface OfferOpenPriceTestCourier {
    courier: User;
    courierHasFixedPrice?: boolean;
    setPrice?: string;
    driver?: Driver;
}

export default interface OfferOpenPriceTest extends CreateNewOrderTest {
    couriersTest: OfferOpenPriceTestCourier[];
    assignButtonIndex: number;
    createNewDriver?: boolean;
}

export interface Driver {
    driverName: string;
    vehicleRegister: string;
}
