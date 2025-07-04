import { expect, test } from '@playwright/test';
import Calculator from '../classes/Calculator';
import { RuleProviderMapper } from '../classes/RuleProviderMapper';
import { PROVIDER_SERVICES } from '../constants';
import { getProviderService } from '../constants/dev-providers';
import { OPERATOR_OPTIONS, PROPERTY_OPTIONS } from '../constants/rulesPropertiesAndOperations';
import RuleService from '../core/RuleService';
import {
    assertRuleCreated,
    conditionRoutine,
    deleteRule,
    getLastPriorityRoutine,
    navigateToRulesPageRoutine,
    openNewRuleForm,
    selectAnotherCondition,
    selectCondition,
    selectProvider,
    setPriorityRoutine,
} from '../functions/steps/rulesSteps';
import { getById } from '../functions/utils/getById';
import { getByIdAndFill } from '../functions/utils/getByIdAndFill';
import isAlertDialogText from '../functions/utils/isAlertDialogText';
import logger from '../functions/utils/logger';
import CreateNewRuleTest from '../interfaces/CreateNewRuleTest';

const ruleService = new RuleService();

const combinationsFor100: Calculator = new Calculator(PROPERTY_OPTIONS, OPERATOR_OPTIONS, '100');

const combinationsFor2000: Calculator = new Calculator(PROPERTY_OPTIONS, OPERATOR_OPTIONS, '2000');

const combinationsFor2335682: Calculator = new Calculator(PROPERTY_OPTIONS, OPERATOR_OPTIONS, '2335682');

const combinationAbcdefg = new Calculator(PROPERTY_OPTIONS, OPERATOR_OPTIONS, 'Abcdefg');

let lastPriorityValue = '1';

const rule1: CreateNewRuleTest = {
    name: 'Regla auto test 1',
    provider: 'GLS',
    service: 0,
    combinationMain: combinationsFor100,
    combination: { i: 0, j: 0 },
    combinationSecondary: combinationsFor100,
    expectedText: '100',
};
const rule2: CreateNewRuleTest = {
    name: 'Regla auto test 2',
    provider: 'GLS',
    service: 1,
    combinationMain: combinationsFor2000,
    combination: { i: 0, j: 0 },
    combinationSecondary: combinationsFor100,
    expectedText: '2000',
};
const rule3: CreateNewRuleTest = {
    name: 'Regla auto test 3',
    provider: 'SEUR',
    service: 0,
    combinationMain: combinationsFor2000,
    combination: { i: 1, j: 1 },
    combinationSecondary: combinationsFor100,
    expectedText: '!= 2000',
};
const rule4: CreateNewRuleTest = {
    name: 'Regla auto test 4',
    provider: 'NARVAL',
    service: 0,
    combinationMain: combinationsFor2335682,
    combination: { i: 2, j: 2 },
    combinationSecondary: combinationsFor100,
    expectedText: '2335682',
};
const rule5: CreateNewRuleTest = {
    name: 'Regla auto test 5',
    provider: 'NARVAL',
    service: 1,
    combinationMain: combinationsFor2335682,
    combination: { i: 3, j: 3 },
    combinationSecondary: combinationsFor100,
    expectedText: '>= 2335682',
};
const rule6: CreateNewRuleTest = {
    name: 'Regla auto test 6',
    provider: 'NARVAL',
    service: 2,
    combinationMain: combinationAbcdefg,
    combination: { i: 4, j: 4 },
    combinationSecondary: combinationsFor100,
    expectedText: '> Abcdefg',
};
const rule7: CreateNewRuleTest = {
    name: 'Regla auto test 7',
    provider: 'NARVAL',
    service: 3,
    combinationMain: combinationsFor2000,
    combination: { i: 5, j: 5 },
    combinationSecondary: combinationsFor100,
    expectedText: '<= 2000',
};
const rule8: CreateNewRuleTest = {
    name: 'Regla auto test 8',
    provider: 'STEF',
    service: 0,
    combinationMain: combinationsFor2000,
    combination: { i: 6, j: 6 },
    combinationSecondary: combinationsFor100,
    expectedText: '< 2000',
};
const rule9: CreateNewRuleTest = {
    name: 'Regla auto test 9',
    provider: 'STEF',
    service: 1,
    combinationMain: combinationsFor2000,
    combination: { i: 6, j: 6 },
    combinationSecondary: combinationsFor100,
    expectedText: '< 2000',
};
const rule10: CreateNewRuleTest = {
    name: 'Regla auto test 10',
    provider: 'STEF',
    service: 0,
    combinationMain: combinationsFor2000,
    combination: { i: 6, j: 6 },
    combinationSecondary: combinationsFor100,
    expectedText: '< 2000',
};
const rule11: CreateNewRuleTest = {
    name: 'Regla auto test 11',
    provider: 'CORREOS',
    service: 1,
    combinationMain: combinationsFor2000,
    combination: { i: 7, j: 2 },
    combinationSecondary: combinationsFor100,
    expectedText: '2000',
};

const ruleThatFails: CreateNewRuleTest = {
    name: 'Debería Fallar',
    provider: 'STEF',
    service: 0,
    combinationMain: combinationsFor2000,
    combination: { i: 6, j: 6 },
    combinationSecondary: combinationsFor100,
    expectedText: '< 2000',
};

let newRuleTests: CreateNewRuleTest[] = [rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9, rule10, rule11];

const providerMapper = new RuleProviderMapper();
// newRuleTests = providerMapper.createRules(newRuleTests); //use this line to test all combinations to create rules

async function clean() {
    newRuleTests.forEach(async (rule) => {
        await deleteRule(rule.name, ruleService);
    });

    await deleteRule(ruleThatFails.name, ruleService);
}

// test.beforeAll('delete tests rules created in the past', async () => {
//     await clean();
// });

// test.afterAll('delete tests rules created in the past', async () => {
//     await clean();
// });

test('should go to the Rules Section and sort by Priority descendant order', async ({ page }) => {
    await navigateToRulesPageRoutine(page);

    lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, 0);
});

// Antes de activar este test, debemos tener previamente una regla con prioridad 1
test('should see an error when try to use the same last priority value', async ({ page }) => {
    await navigateToRulesPageRoutine(page);

    await openNewRuleForm(page);

    // Start fill form
    test.slow();

    const uniqueRuleName: string = 'Regla test va a fallar';

    const name = getById(page, 'name');
    await name.click();
    await name.fill(uniqueRuleName);

    await selectProvider(page, { name: 'GLS', service: 'Estándar 24H' });

    await selectAnotherCondition(page, PROPERTY_OPTIONS, OPERATOR_OPTIONS, combinationsFor100);

    const priorityLocators = getById(page, 'priority');
    await priorityLocators.click();
    await priorityLocators.fill(lastPriorityValue);

    const saveButton = page.getByText('Guardar');
    await saveButton.click();

    const priorityInUse = await isAlertDialogText(page, 'Ya existe una regla con esa prioridad.');
    expect(priorityInUse).toBeTruthy();
});

// Antes de activar este test, debemos tener previamente una regla sin condiciones
test('should see an error when try to save a rule without fill the inputs', async ({ page }) => {
    await navigateToRulesPageRoutine(page);

    await openNewRuleForm(page);

    // Start fill form
    test.slow();

    const saveButton = page.getByText('Guardar');
    await saveButton.click();
    await saveButton.click();

    const priorityInUse = await isAlertDialogText(
        page,
        'Los siguientes campos no son válidos: Proveedor, Nombre, Prioridad'
    );
    expect(priorityInUse).toBeTruthy();
});

newRuleTests.forEach((rule, index) => {
    test(`should validate a rule with parameters: ${rule.name}, ${PROPERTY_OPTIONS[rule.combination.i]} ${OPERATOR_OPTIONS[rule.combination.j]} ${rule.combinationMain.value}`, async ({
        page,
    }) => {
        await navigateToRulesPageRoutine(page);

        lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, index);

        await openNewRuleForm(page);

        // Start fill form
        test.slow();

        await getByIdAndFill(page, 'name', rule.name);

        await selectProvider(page, getProviderService(rule.provider, rule.service, PROVIDER_SERVICES)!);

        await selectCondition(page, PROPERTY_OPTIONS, OPERATOR_OPTIONS, rule.combinationMain, rule.combination);

        lastPriorityValue = await setPriorityRoutine(page, lastPriorityValue);

        await conditionRoutine(page, PROPERTY_OPTIONS, OPERATOR_OPTIONS, rule.combinationSecondary);

        await page.reload({
            waitUntil: 'load',
        });

        lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, index + 1);

        logger.info('  9.Rules.spec.ts:254', { expectedText: rule.expectedText });

        expect(await page.getByText(rule.expectedText).count()).not.toBe(0);

        await assertRuleCreated(page, rule.name);
    });
});
