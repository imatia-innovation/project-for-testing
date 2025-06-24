// Delete all current rules
// Create specific Rules to test conditions
// Create Orders without provider
// Assign a provider following the assignment rules

import test, { Locator } from '@playwright/test';
import { courierFixedPrice, courierNOFixedPrice, PROVIDER_SERVICES } from '../../constants';
import { getProviderService } from '../../constants/dev-providers';
import { OPERATOR_OPTIONS, PROPERTY_OPTIONS } from '../../constants/rulesPropertiesAndOperations';
import { selectCondition } from '../../functions/steps/couriersRulesSteps';
import {
    assertRuleCreated,
    navigateToRulesPageRoutine,
    openNewRuleForm,
    selectProvider,
} from '../../functions/steps/rulesSteps';
import assertByText from '../../functions/utils/assertByText';
import { clickOnText } from '../../functions/utils/clickOnText';
import { getByIdAndFill } from '../../functions/utils/getByIdAndFill';
import logger from '../../functions/utils/logger';
import { selectRegisterPerPage } from '../../functions/utils/pagination';
import CreateNewRuleOrderTest from '../../interfaces/CreateNewRuleOrderTest';

const rule1: CreateNewRuleOrderTest = {
    name: 'Si el alto es igual que 100, asignar a GLS Estándar 24H',
    provider: 'GLS',
    service: 0,
    priority: '1',
    conditions: [
        {
            property: PROPERTY_OPTIONS[0], // Alto
            operation: OPERATOR_OPTIONS[2], // igual que
            value: '100',
        },
    ],
};

const rule2: CreateNewRuleOrderTest = {
    name: 'Si el ancho es menor que 50, asignar a CORREOS Standar Oficina',
    provider: 'CORREOS',
    service: 1,
    priority: '2',
    conditions: [
        {
            property: PROPERTY_OPTIONS[1], // Ancho
            operation: OPERATOR_OPTIONS[6], // menor que
            value: '20',
        },
    ],
};

const rule3: CreateNewRuleOrderTest = {
    name: 'Si el largo es mayor o igual que 100, asignar a ' + courierFixedPrice.providerName!,
    provider: courierFixedPrice.providerName!,
    service: 0,
    priority: '3',
    conditions: [
        {
            property: PROPERTY_OPTIONS[5], // Largo
            operation: OPERATOR_OPTIONS[3], // mayor o igual que
            value: '100',
        },
    ],
};

const rule4: CreateNewRuleOrderTest = {
    name: 'Si el Nro de bultos es menor o igual que 50, asignar a ' + courierNOFixedPrice.providerName!,
    provider: courierNOFixedPrice.providerName!,
    service: 0,
    priority: '4',
    conditions: [
        {
            property: PROPERTY_OPTIONS[6], // Nro Bultos
            operation: OPERATOR_OPTIONS[5], // menor o igual que
            value: '50',
        },
    ],
};

const rule5: CreateNewRuleOrderTest = {
    name: 'Si el Peso contiene 51, asignar a NARVAL',
    provider: 'NARVAL',
    service: 0,
    priority: '5',
    conditions: [
        {
            property: PROPERTY_OPTIONS[7], // Peso
            operation: OPERATOR_OPTIONS[0], // contiene
            value: '51',
        },
    ],
};

const rule6: CreateNewRuleOrderTest = {
    name: 'Si el CP Origen distinto de 32900, asignar a SEUR',
    provider: 'SEUR',
    service: 0,
    priority: '6',
    conditions: [
        {
            property: PROPERTY_OPTIONS[3], // CP Origen
            operation: OPERATOR_OPTIONS[1], // distinto
            value: '32900',
        },
    ],
};

const rule7: CreateNewRuleOrderTest = {
    name: 'Si el CP Destino mayor que 15000 y Peso mayor o igual que 200, asignar a NARVAL Congelado',
    provider: 'NARVAL',
    service: 1,
    priority: '7',
    conditions: [
        {
            property: PROPERTY_OPTIONS[2], // CP Destino
            operation: OPERATOR_OPTIONS[4], // mayor que
            value: '15000',
        },
        {
            property: PROPERTY_OPTIONS[7], // Peso
            operation: OPERATOR_OPTIONS[3], // mayor o igual que
            value: '200',
        },
    ],
};

const rule8: CreateNewRuleOrderTest = {
    name: 'Si la Empresa contiene aaa123aaa, asignar a NARVAL Mixto',
    provider: 'NARVAL',
    service: 2,
    priority: '8',
    conditions: [
        {
            property: PROPERTY_OPTIONS[4], // Empresa
            operation: OPERATOR_OPTIONS[0], // contiene
            value: 'aaa123aaa',
        },
    ],
};

const rule9: CreateNewRuleOrderTest = {
    name: 'Si no cumple con las condiciones anteriores, asignar a BAJO COTIZACIÓN',
    provider: 'BAJO COTIZACIÓN',
    service: 0,
    priority: '9',
    conditions: [], // --
};

let newRuleTests: CreateNewRuleOrderTest[] = [rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9];

test('Delete all rules test', async ({ page }) => {
    await navigateToRulesPageRoutine(page);

    await selectRegisterPerPage(page);

    const checkAllLocator: Locator = page.getByRole('checkbox');

    const checkboxes: Locator[] = await checkAllLocator.all();
    logger.info('1.courierRules.spec.spec.ts checkboxes.length: ', checkboxes.length);

    await checkAllLocator.first().click();

    await clickOnText(page, 'Eliminar');

    const deleteLocator: Locator = page.getByText(' Eliminar ');

    const deleteButtons: Locator[] = await deleteLocator.all();
    logger.info('1.courierRules.spec.spec.ts deleteButtons.length ', deleteButtons.length);

    await assertByText(
        page,
        'Las reglas eliminadas dejarán de utilizarse en la asignación automática de proveedores. ¿Desea continuar?'
    );

    await deleteLocator.last().click();
});

test('Create rules', async ({ page }) => {
    await navigateToRulesPageRoutine(page);

    for (let index = 0; index < newRuleTests.length; index++) {
        const rule = newRuleTests[index];

        logger.info(
            `1.couriersAssignedByRules.spec.ts rule${index} parameters: ${rule.name}, ${rule.conditions} provider: ${rule.provider}, priority: ${rule.priority}`
        );

        await openNewRuleForm(page);

        // Start fill form
        test.slow();

        await getByIdAndFill(page, 'name', rule.name);

        await selectProvider(page, getProviderService(rule.provider, rule.service, PROVIDER_SERVICES)!);

        await getByIdAndFill(page, 'priority', rule.priority);

        for (let i = 0; i < rule.conditions.length; i++) {
            const condition = rule.conditions[i];
            await selectCondition(page, condition);
        }

        const saveButton = page.getByText('Guardar');
        await saveButton.click();

        await page.reload({
            waitUntil: 'load',
        });

        await assertRuleCreated(page, rule.name);
    }
});
