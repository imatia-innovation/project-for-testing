import { Page } from '@playwright/test';
import assertList from '../utils/assertList';
import { getByAttribute } from '../utils/getByAttribute';
import { getById } from '../utils/getById';
import logger from '../utils/logger';
import { Condition } from '../../interfaces/CreateNewRuleOrderTest';
import { OPERATOR_OPTIONS, PROPERTY_OPTIONS } from '../../constants/rulesPropertiesAndOperations';

export async function selectCondition(page: Page, condition: Condition) {
    logger.info(' Start couriersAssignedByRulesSteps.ts selectCondition', condition);

    const property = getByAttribute(page, 'attr', 'property_id');
    await property.click();
    await assertList(page, PROPERTY_OPTIONS);

    const propertyLocator = page.getByText(condition.property);
    await propertyLocator.last().click();

    const operator = getByAttribute(page, 'attr', 'operator_id');
    await operator.click();
    await assertList(page, OPERATOR_OPTIONS);

    const operationLocators = page.getByText(condition.operation);
    await operationLocators.last().click();

    const value = getById(page, 'value');
    await value.click();
    await value.fill(condition.value);

    const addCondition = page.getByText('Añadir condición');
    await addCondition.click();

    logger.info(' Finish couriersAssignedByRulesSteps.ts selectCondition', condition);
}
