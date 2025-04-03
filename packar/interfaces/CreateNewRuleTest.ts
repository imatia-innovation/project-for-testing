import Calculator from '../classes/Calculator';
import Combination from './Combination';

export default interface CreateNewRuleTest {
    name: string;
    provider: string;
    service: number;
    combinationMain: Calculator;
    combination: Combination;
    combinationSecondary: Calculator;
    expectedText: string;
}
