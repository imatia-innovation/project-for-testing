import { getProviderService, PROVIDER_SERVICES, ProviderServices } from '../constants/providers';
import CreateNewRuleTest from '../interfaces/CreateNewRuleTest';
import { OPERATOR_OPTIONS, PROPERTY_OPTIONS } from '../tests/rules.spec';
import Calculator from './Calculator';

interface Combination {
    provider: string;
    service: number;
    used: boolean;
}

export class RuleProviderMapper {
    combinations: Combination[] = [];

    calculateAllCombinations(): void {
        PROVIDER_SERVICES.forEach((element: ProviderServices) => {
            element.services.forEach((_service: string, index) => {
                this.combinations.push({
                    provider: element.name,
                    service: index,
                    used: false,
                });
            });
        });
    }

    mapTests(tests: any[]): void {
        this.combinations = this.combinations.map((combination) => {
            const foundRuleTestCombination = tests.find(
                (test) => test.provider === combination.provider && test.service === combination.service
            );
            if (foundRuleTestCombination) {
                combination.used = true;
            }

            return combination;
        });
    }

    createMissingRule(combination: Combination, index: number): CreateNewRuleTest {
        const combinationForOperations = new Calculator(PROPERTY_OPTIONS, OPERATOR_OPTIONS, index.toString());

        return {
            name:
                'Regla auto test ' +
                index +
                ' provider: ' +
                combination.provider +
                ' service: ' +
                getProviderService(combination.provider, combination.service)?.service,
            provider: combination.provider,
            service: combination.service,
            combinationMain: combinationForOperations,
            combination: { i: 0, j: 0 },
            combinationSecondary: combinationForOperations,
            expectedText: '100',
        };
    }

    createRules(ruleTests: CreateNewRuleTest[]): CreateNewRuleTest[] {
        this.calculateAllCombinations();

        this.mapTests(ruleTests);

        const missingCombinations: Combination[] = this.combinations.filter(
            (combination: Combination) => !combination.used
        );

        let moreRuleTests: CreateNewRuleTest[] = [];

        missingCombinations.forEach((missingRuleCombination: Combination, index) => {
            moreRuleTests.push(this.createMissingRule(missingRuleCombination, index));
        });

        return ruleTests.concat(moreRuleTests);
    }
}
