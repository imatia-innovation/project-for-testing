import { test, expect } from '@playwright/test';
import login from '../functions/login';
import { admin, baserUrl } from '../constants';
import assertElementsByText from '../functions/assertElementsByText';
import alertdialogExist from '../functions/elementExistByText';
import selectCondition from '../functions/selectCondition';
import Calculator from '../classes/Calculator';
import getMaxPriority from '../functions/getMaxPriority';
import RuleService from '../core/RuleService';

const ruleService = new RuleService();

const columns = [
    'Prioridad',
    'Nombre',
    'Código postal origen',
    'Código postal destino',
    'Dimensiones (LxWxH)',
    'Peso (Kg)',
    'Proveedor',
    'Empresa',
    'Servicio',
];

const formSections = ['Información', 'Nueva condición', 'Condiciones'];

const propertyOptions = [
    'Alto (cm)',
    'Ancho (cm)',
    'Alto (cm)',
    'Código postal destino',
    'Código postal origen',
    'Empresa',
    'Largo (cm)',
    'Peso',
];

const operatorOptions = [
    'Contiene',
    'Distinto de',
    'Igual a',
    'Mayor e igual que',
    'Mayor que',
    'Menor e igual que',
    'Menor que',
];

const calculator = new Calculator(propertyOptions, operatorOptions);

let lastPriorityValue = '1';

test(`should make login with admin user and go to the Rules Section and sort by Priority descendant order`, async ({
    page,
}) => {
    await login(page, admin);

    const rulesLocator = page.getByText('Reglas');
    await rulesLocator.first().click();

    await page.waitForURL(baserUrl + '/app/main/rules');
    expect(page.url()).toContain(baserUrl + '/app/main/rules');

    assertElementsByText(page, columns);

    const createNewRuleLocator = page.getByText('Nuevo');
    expect(createNewRuleLocator).not.toBeNull();

    //Select 100 in te pagination
    const paginationSelectOption = page.getByRole('listbox');
    await paginationSelectOption.click();

    const optionLast = page.getByRole('option').last();
    await optionLast.click();

    //Sort by Priority descendant
    const priorityLocator = page.getByText('Prioridad');
    await priorityLocator.first().click();
    await priorityLocator.first().click();

    page.waitForLoadState('load');

    lastPriorityValue = await getMaxPriority(page);
});

test(`should make login with admin user and see an error when try to use the same last priority value`, async ({
    page,
}) => {
    await login(page, admin);

    const rulesLocator = page.getByText('Reglas');
    await rulesLocator.first().click();

    await page.waitForURL(baserUrl + '/app/main/rules');
    expect(page.url()).toContain(baserUrl + '/app/main/rules');

    assertElementsByText(page, columns);

    const createNewRuleLocator = page.locator('button').getByText('Nuevo');
    await createNewRuleLocator.click();

    let formTitleLocator = page.getByText('Reglas: Nuevo');
    expect(formTitleLocator).not.toBeNull();

    assertElementsByText(page, formSections);

    const saveButtonLocator = page.locator('button').getByText('Guardar');
    expect(saveButtonLocator).not.toBeNull();

    const cancelButtonLocator = page.locator('button').getByText('Cancelar');
    expect(cancelButtonLocator).not.toBeNull();

    // Start fill form
    // test.slow();

    const uniqueRuleName: string = 'Regla test ' + new Date().getTime().toString();

    const name = page.getByLabel('Nombre *');
    await name.click();
    await name.fill(uniqueRuleName);

    const provider = page.getByLabel('Proveedor *');
    await provider.click();
    const glsProviderLocators = page.getByText('GLS');
    await glsProviderLocators.last().click();

    const service = page.getByLabel('Tipo de servicio *');
    await service.click();
    const standard24ServiceLocators = page.getByText('Estándar 24H');
    await standard24ServiceLocators.last().click();

    await selectCondition(page, propertyOptions, operatorOptions, calculator, '100');

    const priorityLocators = page.getByLabel('Prioridad *');
    await priorityLocators.click();
    await priorityLocators.fill(lastPriorityValue);

    const saveButton = page.getByText('Guardar');
    await saveButton.click();

    const priorityInUse = await alertdialogExist(page, 'Ya existe una regla con esa prioridad.');
    expect(priorityInUse).toBeTruthy();
});

test(`should make login with admin user and open the form to create new rule`, async ({ page }) => {
    await login(page, admin);

    const rulesLocator = page.getByText('Reglas');
    await rulesLocator.first().click();

    await page.waitForURL(baserUrl + '/app/main/rules');
    expect(page.url()).toContain(baserUrl + '/app/main/rules');

    assertElementsByText(page, columns);

    const createNewRuleLocator = page.locator('button').getByText('Nuevo');
    await createNewRuleLocator.click();

    let formTitleLocator = page.getByText('Reglas: Nuevo');
    expect(formTitleLocator).not.toBeNull();

    assertElementsByText(page, formSections);

    const saveButtonLocator = page.locator('button').getByText('Guardar');
    expect(saveButtonLocator).not.toBeNull();

    const cancelButtonLocator = page.locator('button').getByText('Cancelar');
    expect(cancelButtonLocator).not.toBeNull();

    // Start fill form
    test.slow();

    const uniqueRuleName: string = 'Regla test ' + new Date().getTime().toString();

    const name = page.getByLabel('Nombre *');
    await name.click();
    await name.fill(uniqueRuleName);

    const provider = page.getByLabel('Proveedor *');
    await provider.click();
    const glsProviderLocators = page.getByText('GLS');
    await glsProviderLocators.last().click();

    const service = page.getByLabel('Tipo de servicio *');
    await service.click();
    const standard24ServiceLocators = page.getByText('Estándar 24H');
    await standard24ServiceLocators.last().click();

    await selectCondition(page, propertyOptions, operatorOptions, calculator, '100');

    let priority: number = Number(lastPriorityValue) + 1;

    const priorityLocators = page.getByLabel('Prioridad *');
    await priorityLocators.click();
    await priorityLocators.fill(priority.toString());

    const saveButton = page.getByText('Guardar');
    await saveButton.click();

    let priorityInUse = await alertdialogExist(page, 'Ya existe una regla con esa prioridad.');

    while (priorityInUse) {
        const okButton = page.getByText('Ok');
        await okButton.click();

        priority = priority + 1;

        const priorityLocators = page.getByLabel('Prioridad *');
        await priorityLocators.click();
        await priorityLocators.fill(priority.toString());

        const saveButton = page.getByText('Guardar');
        await saveButton.click();

        priorityInUse = await alertdialogExist(page, 'Ya existe una regla con esa prioridad.');
    }

    let conditionsInUse: boolean = await alertdialogExist(page, 'Ya existe una regla con esas condiciones.');

    while (conditionsInUse) {
        const okButton = page.getByText('Ok');
        await okButton.click();

        await selectCondition(page, propertyOptions, operatorOptions, calculator, '100');

        const saveButton = page.getByText('Guardar');
        await saveButton.click();

        conditionsInUse = await alertdialogExist(page, 'Ya existe una regla con esas condiciones.');
    }

    expect(conditionsInUse).toBeFalsy();

    await page.reload({
        waitUntil: 'load',
    });

    const ruleCreated = await page.getByText(uniqueRuleName).first().innerHTML();

    expect(ruleCreated).toBeTruthy();

    // Delete rule using the core service
    const response = await ruleService.deleteRule(admin.username, admin.password, uniqueRuleName);
    expect(response?.data.status).toEqual('OK');
    expect(response?.data.message).toEqual(`Rule deleted successfully: ${uniqueRuleName}`);
});
