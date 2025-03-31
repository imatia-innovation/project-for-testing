import { test, expect } from '@playwright/test';
import isAlertDialogText from '../functions/utils/isAlertDialogText';
import Calculator from '../classes/Calculator';
import RuleService from '../core/RuleService';
import {
    conditionRoutine,
    openNewRuleForm,
    setPriorityRoutine as setPriorityRoutine,
    selectAnotherCondition,
    selectCondition,
    selectProvider,
    getLastPriorityRoutine,
    navigateToRulesPageRoutine,
    assertRuleCreated,
    deleteRule,
} from '../functions/steps/rulesSteps';
import CreateRuleFormTest from '../classes/CreateRuleFormTest';

const ruleService = new RuleService();

const columns: string[] = [
    'Reglas de asignación',
    'Prioridad',
    'Nombre',
    'CP origen',
    'CP destino',
    'Alto (cm)',
    'Ancho (cm)',
    'Largo (cm)',
    'Peso (Kg)',
    'Empresa',
    'Proveedor',
    'Servicio',
];

const formSections: string[] = ['Información', 'Nueva condición', 'Condiciones'];

const propertyOptions: string[] = [
    'Alto (cm)',
    'Ancho (cm)',
    'Código postal destino',
    'Código postal origen',
    'Empresa',
    'Largo (cm)',
    'Peso',
];

const operatorOptions: string[] = [
    'Contiene',
    'Distinto de',
    'Igual a',
    'Mayor e igual que',
    'Mayor que',
    'Menor e igual que',
    'Menor que',
];

const combinationsFor100: Calculator = new Calculator(propertyOptions, operatorOptions, '100');

const combinationsFor2000: Calculator = new Calculator(propertyOptions, operatorOptions, '2000');

const combinationsFor2335682: Calculator = new Calculator(propertyOptions, operatorOptions, '2335682');

const combinationAbcdefg = new Calculator(propertyOptions, operatorOptions, 'Abcdefg');

let lastPriorityValue = '1';

const rule1 = new CreateRuleFormTest(
    'Regla auto test 1',
    { name: 'GLS', service: 'Estándar 24H' },
    combinationsFor100,
    { i: 0, j: 0 },
    combinationsFor100,
    'CONTAINS 100'
);
const rule2 = new CreateRuleFormTest(
    'Regla auto test 2',
    { name: 'GLS', service: 'Estándar devoluciones en tienda' },
    combinationsFor2000,
    { i: 0, j: 0 },
    combinationsFor100,
    'CONTAINS 2000'
);
const rule3 = new CreateRuleFormTest(
    'Regla auto test 3',
    { name: 'SEUR', service: 'SEUR FRIO 13:30' },
    combinationsFor2000,
    { i: 1, j: 1 },
    combinationsFor100,
    '!= 2000'
);
const rule4 = new CreateRuleFormTest(
    'Regla auto test 4',
    { name: 'NARVAL', service: 'REFRIGERADO' },
    combinationsFor2335682,
    { i: 2, j: 2 },
    combinationsFor100,
    '2335682'
);
const rule5 = new CreateRuleFormTest(
    'Regla auto test 5',
    { name: 'NARVAL', service: 'CONGELADO' },
    combinationsFor2335682,
    { i: 3, j: 3 },
    combinationsFor100,
    '>= 2335682'
);
const rule6 = new CreateRuleFormTest(
    'Regla auto test 6',
    { name: 'NARVAL', service: 'MIXTO' },
    combinationAbcdefg,
    { i: 4, j: 4 },
    combinationsFor100,
    '> Abcdefg'
);
const rule7 = new CreateRuleFormTest(
    'Regla auto test 7',
    { name: 'NARVAL', service: 'SECO' },
    combinationsFor2000,
    { i: 5, j: 5 },
    combinationsFor100,
    '<= 2000'
);
const rule8 = new CreateRuleFormTest(
    'Regla auto test 8',
    { name: 'STEF', service: 'Fresco o Seco' },
    combinationsFor2000,
    { i: 6, j: 6 },
    combinationsFor100,
    '< 2000'
);
const rule9 = new CreateRuleFormTest(
    'Regla auto test 9',
    { name: 'STEF', service: 'Congelado' },
    combinationsFor2000,
    { i: 6, j: 6 },
    combinationsFor100,
    '< 2000'
);
const rule10 = new CreateRuleFormTest(
    'Regla auto test 10',
    { name: 'STEF', service: 'Congelado' },
    combinationsFor2000,
    { i: 6, j: 6 },
    combinationsFor100,
    '< 2000'
);

const ruleThatFails = new CreateRuleFormTest(
    'Debería Fallar',
    { name: 'STEF', service: 'Congelado' },
    combinationsFor2000,
    { i: 6, j: 6 },
    combinationsFor100,
    '< 2000'
);

const ruleNoConditions = {
    name: 'Regla auto test sin condiciones',
    provider: {
        name: 'STEF',
        service: 'Congelado',
    },
};

const rulesParameters: CreateRuleFormTest[] = [rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9, rule10];

test.beforeAll('delete tests rules created in the past', async () => {
    rulesParameters.forEach(async (rule) => {
        await deleteRule(rule.name, ruleService);
    });

    await deleteRule(ruleThatFails.name, ruleService);

    await deleteRule(ruleNoConditions.name, ruleService);
});

test(`should go to the Rules Section and sort by Priority descendant order`, async ({ page }) => {
    await navigateToRulesPageRoutine(page, columns);

    lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, 0);
});

test(`should see an error when try to use the same last priority value`, async ({ page }) => {
    await navigateToRulesPageRoutine(page, columns);

    await openNewRuleForm(page, formSections);

    // Start fill form
    test.slow();

    const uniqueRuleName: string = 'Regla test va a fallar';

    const name = page.getByLabel('Nombre *');
    await name.click();
    await name.fill(uniqueRuleName);

    await selectProvider(page, { name: 'GLS', service: 'Estándar 24H' });

    await selectAnotherCondition(page, propertyOptions, operatorOptions, combinationsFor100);

    const priorityLocators = page.getByLabel('Prioridad *');
    await priorityLocators.click();
    await priorityLocators.fill(lastPriorityValue);

    const saveButton = page.getByText('Guardar');
    await saveButton.click();

    const priorityInUse = await isAlertDialogText(page, 'Ya existe una regla con esa prioridad.');
    expect(priorityInUse).toBeTruthy();
});

test(`should see an error when try to save a rule without fill the inputs`, async ({ page }) => {
    await navigateToRulesPageRoutine(page, columns);

    await openNewRuleForm(page, formSections);

    // Start fill form
    test.slow();

    const saveButton = page.getByText('Guardar');
    await saveButton.click();

    const priorityInUse = await isAlertDialogText(
        page,
        'Los siguientes campos no son válidos: Proveedor, Nombre, Prioridad'
    );
    expect(priorityInUse).toBeTruthy();
});

test(`should create an rule without conditions if it does not exist and if exist, watch an error message`, async ({
    page,
}) => {
    await navigateToRulesPageRoutine(page, columns);

    lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, 0);

    await openNewRuleForm(page, formSections);

    const saveButton = page.getByText('Guardar');
    await saveButton.click();

    const requiredError = await isAlertDialogText(
        page,
        'Los siguientes campos no son válidos: Proveedor, Nombre, Prioridad'
    );
    expect(requiredError).toBeTruthy();

    const okButton = page.getByText('Ok');
    await okButton.click();

    // Start fill form
    test.slow();

    const name = page.getByLabel('Nombre *');
    await name.click();
    await name.fill(ruleNoConditions.name);

    await selectProvider(page, ruleNoConditions.provider);

    lastPriorityValue = await setPriorityRoutine(page, lastPriorityValue);

    let conditionsInUse: boolean = await isAlertDialogText(page, 'Ya existe una regla con esas condiciones.');

    if (conditionsInUse) {
        // close modal, close form and watch table

        const okBtn = page.getByText('Ok');
        await okBtn.click();

        const cancelBtn = page.getByText('Cancelar');
        await cancelBtn.click();

        await page.reload({
            waitUntil: 'load',
        });

        lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, 1);

        expect(await page.getByText(ruleNoConditions.name).count()).toBe(0);
    } else {
        // created rule

        expect(await page.getByText(ruleNoConditions.name).count()).not.toBe(0);
        await assertRuleCreated(page, ruleNoConditions.name);
    }
});

rulesParameters.forEach((rule, index) => {
    test(`should validate a rule with parameters: ${rule.name}, ${propertyOptions[rule.combination.i]} ${operatorOptions[rule.combination.j]} ${rule.combinationMain.value}`, async ({
        page,
    }) => {
        await navigateToRulesPageRoutine(page, columns);

        lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, index);

        await openNewRuleForm(page, formSections);

        // Start fill form
        test.slow();

        const name = page.getByLabel('Nombre *');
        await name.click();
        await name.fill(rule.name);

        await selectProvider(page, rule.provider);

        await selectCondition(page, propertyOptions, operatorOptions, rule.combinationMain, rule.combination);

        lastPriorityValue = await setPriorityRoutine(page, lastPriorityValue);

        await conditionRoutine(page, propertyOptions, operatorOptions, rule.combinationSecondary);

        await page.reload({
            waitUntil: 'load',
        });

        lastPriorityValue = await getLastPriorityRoutine(page, lastPriorityValue, index + 1);

        expect(await page.getByText(rule.expectedText).count()).not.toBe(0);

        await assertRuleCreated(page, rule.name);
    });
});
