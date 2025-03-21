import Combination from '../interfaces/Combination';

export default class Calculator {
    value: string = '1';

    constructor(array1: string[], array2: string[], value: string) {
        this.calculatePossibleCombinations(array1, array2);
        this.value = value;
    }

    combination: Combination = {
        i: 0,
        j: 0,
    };

    possibleCombinations: Combination[] = [];

    calculatePossibleCombinations(array1: string[], array2: string[]): void {
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < array2.length; j++) {
                this.possibleCombinations.push({ i, j, used: false });
            }
        }
    }

    setCombinationUsed(combination?: Combination): Combination | undefined {
        let element = this.possibleCombinations.find((item) => {
            if (combination && combination.i && combination.j) {
                return item.i === combination.i && item.j === combination.j;
            }
            return item.i === this.combination.i && item.j === this.combination.j;
        });

        if (element && !element.used) {
            element.used = true;
        }

        return this.getAvailableCombination();
    }

    getAvailableCombination(): Combination | undefined {
        const result = this.possibleCombinations.find((item) => !item.used);
        if (result) {
            this.combination = result;
        }
        return result;
    }
}
