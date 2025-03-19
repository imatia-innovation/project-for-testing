import Combination from '../interfaces/Combination';

export default class Calculator {
    constructor(array1: string[], array2: string[]) {
        this.calculatePossibleCombinations(array1, array2);
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

    setCombinationUsed(): Combination | undefined {
        let element = this.possibleCombinations.find(
            (item) => item.i === this.combination.i && item.j === this.combination.j
        );

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
