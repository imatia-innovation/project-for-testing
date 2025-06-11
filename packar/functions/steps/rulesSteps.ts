import { expect, Page } from '@playwright/test';
import { admin } from '../../constants';
import assertList from '../utils/assertList';
import login from './login';
import isAlertDialogText from '../utils/isAlertDialogText';
import Calculator from '../../classes/Calculator';
import RuleService from '../../core/RuleService';
import getMaxColumnNumericValue from '../utils/getMaxColumnNumericValue';
import Combination from '../../interfaces/Combination';
import Provider from '../../interfaces/Provider';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { clickOnText } from '../utils/clickOnText';
import { getByAttribute } from '../utils/getByAttribute';
import { getById } from '../utils/getById';
import logger from '../utils/logger';

const RULES_PAGE_TEXT: string[] = [
    'Reglas de asignación',
    'Prioridad',
    'Nombre',
    'CP origen',
    'CP destino',
    'Alto (cm)',
    'Ancho (cm)',
    'Largo (cm)',
    'Peso (Kg)',
    'Número de bultos',
    'Empresa',
    'Proveedor',
    'Servicio',
];

const FORM_SECTIONS: string[] = ['Información', 'Nueva condición', 'Condiciones'];

export async function navigateToRulesPageRoutine(page: Page) {
    logger.info('Start rulesSteps.ts navigateToRulesPageRoutine');
    await login(page, admin);

    await clickOnText(page, 'Reglas');

    await waitUntilUrlLoads(page, '/app/main/rules');

    await assertList(page, RULES_PAGE_TEXT);

    const createNewRuleLocator = await page.locator('button').getByText('Nueva regla').count();
    expect(createNewRuleLocator).not.toBe(0);

    const deleteRuleLocator = await page.locator('button').getByText('Eliminar').count();
    expect(deleteRuleLocator).not.toBe(0);

    const refreshLocator = await page.locator('button').getByText('Refrescar').count();
    expect(refreshLocator).not.toBe(0);
    logger.info('Finish rulesSteps.ts navigateToRulesPageRoutine');
}

export async function getLastPriorityRoutine(page: Page, lastPriorityValue: string, index: number) {
    logger.info('Start rulesSteps.ts getLastPriorityRoutine', { lastPriorityValue, index });
    //Select 100 in te pagination
    const paginationSelectOption = page.getByRole('combobox');
    await paginationSelectOption.click();

    const optionLast = page.getByRole('option').last();
    await optionLast.click();

    //Sort by Priority descendant
    const priorityLocator = page.getByText('Prioridad');

    let maxN = '1';
    if (index === 0) {
        await priorityLocator.first().click();
        await page.waitForLoadState('load');
        maxN = await getMaxColumnNumericValue(page, lastPriorityValue);
    } else {
        maxN = lastPriorityValue;
        if (!(index % 2 == 0)) {
            await priorityLocator.first().click();
            await page.waitForLoadState('load');
        }
    }
    logger.info('Finish rulesSteps.ts getLastPriorityRoutine', { maxN });
    return maxN;
}

export async function openNewRuleForm(page: Page) {
    logger.info('Start rulesSteps.ts openNewRuleForm');
    const createNewRuleLocator = page.locator('button').getByText('Nueva regla');
    await createNewRuleLocator.click();

    let formTitleLocator = page.getByText('Reglas: Nuevo');
    expect(formTitleLocator).not.toBeNull();

    await assertList(page, FORM_SECTIONS);

    const saveButtonLocator = page.locator('button').getByText('Guardar');
    expect(saveButtonLocator).not.toBeNull();

    const cancelButtonLocator = page.locator('button').getByText('Cancelar');
    expect(cancelButtonLocator).not.toBeNull();
    logger.info('Finish rulesSteps.ts openNewRuleForm');
}

export async function selectProvider(page: Page, provider: Provider) {
    logger.info('Start rulesSteps.ts selectProvider', { provider });
    const providerLabel = getByAttribute(page, 'attr', 'courier_id');
    await providerLabel.click();
    const providerLocators = page.getByText(provider.name);
    await providerLocators.last().click();

    const service = getByAttribute(page, 'attr', 'courier_shipment_type_id');
    await service.click();

    const serviceLocators = page.getByText(provider.service);
    await serviceLocators.last().click();
    logger.info('Finish rulesSteps.ts selectProvider');
}

export async function setPriorityRoutine(page: Page, lastPriorityValue: string): Promise<string> {
    logger.info('Start rulesSteps.ts setPriorityRoutine', { lastPriorityValue });
    let priority: number = Number(lastPriorityValue) + 1;

    const priorityLocator = getById(page, 'priority');

    //await priorityLocators.click();

    await priorityLocator.fill(priority.toString());

    const saveButton = page.getByText('Guardar');
    await saveButton.click();

    let priorityInUse = await isAlertDialogText(page, 'Ya existe una regla con esa prioridad.');

    while (priorityInUse) {
        const okButton = page.getByText('Ok');
        await okButton.click();

        priority = priority + 1;

        const priorityLocators = getById(page, 'priority');
        //await priorityLocators.click();
        await priorityLocators.fill(priority.toString());

        const saveButton = page.getByText('Guardar');
        await saveButton.click();

        priorityInUse = await isAlertDialogText(page, 'Ya existe una regla con esa prioridad.');
    }

    expect(priorityInUse).toBeFalsy();

    logger.info('Finish rulesSteps.ts setPriorityRoutine', { priority });

    return priority.toString();
}

export async function conditionRoutine(
    page: Page,
    propertyOptions: string[],
    operatorOptions: string[],
    calculator: Calculator
) {
    logger.info('Start rulesSteps.ts conditionRoutine');
    let conditionsInUse: boolean = await isAlertDialogText(page, 'Ya existe una regla con esas condiciones.');

    while (conditionsInUse) {
        const okButton = page.getByText('Ok');
        await okButton.click();

        await selectAnotherCondition(page, propertyOptions, operatorOptions, calculator);

        const saveButton = page.getByText('Guardar');
        await saveButton.click();

        conditionsInUse = await isAlertDialogText(page, 'Ya existe una regla con esas condiciones.');
    }

    logger.info('Finish rulesSteps.ts conditionRoutine');
    expect(conditionsInUse).toBeFalsy();
}

export async function assertRuleCreated(page: Page, uniqueRuleName: string) {
    logger.info('Start rulesSteps.ts assertRuleCreated', { uniqueRuleName });
    const ruleCreated = await page.getByText(uniqueRuleName).first().innerHTML();
    expect(ruleCreated).toBeTruthy();
    logger.info('Finish rulesSteps.ts assertRuleCreated');
}

export async function deleteRule(uniqueRuleName: string, ruleService: RuleService) {
    await ruleService.deleteRule(admin.username, admin.password, uniqueRuleName);
}

export async function selectAnotherCondition(
    page: Page,
    propertyOptions: string[],
    operatorOptions: string[],
    calculator: Calculator
) {
    const property = getByAttribute(page, 'attr', 'property_id');
    await property.click();
    await assertList(page, propertyOptions);

    const propertyLocator = page.getByText(propertyOptions[calculator.combination.i]);
    await propertyLocator.last().click();

    const operator = getByAttribute(page, 'attr', 'operator_id');
    await operator.click();
    await assertList(page, operatorOptions);

    const operationLocators = page.getByText(operatorOptions[calculator.combination.j]);
    await operationLocators.last().click();

    const value = getById(page, 'value');
    await value.click();
    await value.fill(calculator.value);

    const addCondition = page.getByText('Añadir condición');
    await addCondition.click();

    return calculator.setCombinationUsed();
}

export async function selectCondition(
    page: Page,
    propertyOptions: string[],
    operatorOptions: string[],
    calculator: Calculator,
    combination: Combination
) {
    logger.info('Start rulesSteps.ts selectCondition', {
        condition: propertyOptions[combination.i] + operatorOptions[combination.j],
    });
    const property = getByAttribute(page, 'attr', 'property_id');
    await property.click();
    await assertList(page, propertyOptions);

    const propertyLocator = page.getByText(propertyOptions[combination.i]);
    await propertyLocator.last().click();

    const operator = getByAttribute(page, 'attr', 'operator_id');
    await operator.click();
    await assertList(page, operatorOptions);

    const operationLocators = page.getByText(operatorOptions[combination.j]);
    await operationLocators.last().click();

    const value = getById(page, 'value');
    await value.click();
    await value.fill(calculator.value);

    const addCondition = page.getByText('Añadir condición');
    await addCondition.click();

    logger.info('Finish rulesSteps.ts selectCondition', {
        condition: propertyOptions[combination.i] + operatorOptions[combination.j],
    });
    return calculator.setCombinationUsed(combination);
}
