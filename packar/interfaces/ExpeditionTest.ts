import OfferTest from './OfferTest';
import User from './User';

export default interface ExpeditionTest {
    title: string;
    courier: User;
    order: OfferTest;
}
