import Combination from '../interfaces/Combination';
import Provider from '../interfaces/Provider';
import Calculator from './Calculator';

export default class CreateRuleFormTest {
    name: string;
    provider: Provider;
    combinationMain: Calculator;
    combination: Combination;
    combinationSecondary: Calculator;
    expectedText: string;

    constructor(
        name: string,
        provider: Provider,
        combinationMain: Calculator,
        combination: Combination,
        combinationSecondary: Calculator,
        expectedText: string
    ) {
        this.name = name;
        this.provider = provider;
        this.combinationMain = combinationMain;
        this.combination = combination;
        this.combinationSecondary = combinationSecondary;
        this.expectedText = expectedText;
    }
}
