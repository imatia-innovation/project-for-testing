import { Page } from '@playwright/test';
import { getProviderService, PROVIDER_SERVICES, ProviderServices } from '../constants/providers';
import { selectBox } from '../functions/steps/ordersSteps';
import CreateNewOrderTest from '../interfaces/CreateNewOrderTest';
import { destination_favorite, pickUpLocation } from '../constants';

interface Combination {
    provider: string;
    service: number;
    used: boolean;
}

export class OrderProviderMapper {
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

    createLeftOrder(combination: Combination, index: number): CreateNewOrderTest {
        return {
            title:
                'should create new order with the minimum fields selecting Partial Order, provider: ' +
                combination.provider +
                ' service: ' +
                getProviderService(combination.provider, combination.service)?.service,
            pickUpLocation,
            reference: 'atest' + new Date().getTime().toString(),
            provider: combination.provider,
            service: combination.service,
            selectPackage: async (page: Page) => {
                await selectBox(page, { length: index, width: index, height: index, weight: index });
            },
            destination: {
                favorite: destination_favorite,
                saveAsNew: false,
                remarks: 'This is an automatic test',
            },
        };
    }

    createOrders(orderTests: CreateNewOrderTest[]): CreateNewOrderTest[] {
        this.calculateAllCombinations();

        this.mapTests(orderTests);

        const leftCombinations: Combination[] = this.combinations.filter(
            (combination: Combination) => !combination.used
        );

        let moreOrderTests: CreateNewOrderTest[] = [];

        leftCombinations.forEach((missingOrder: Combination, index) => {
            moreOrderTests.push(this.createLeftOrder(missingOrder, index + 1));
        });

        return orderTests.concat(moreOrderTests);
    }
}
