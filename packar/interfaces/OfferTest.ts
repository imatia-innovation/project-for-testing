import CreateNewOrderTest from './CreateNewOrderTest';
import User from './User';

export default interface OfferTest extends CreateNewOrderTest {
    courier: User;
    courierHasFixedPrice?: boolean;
    setPrice?: string;
}
