import { Page } from '@playwright/test';
import { OPERATOR_OPTIONS, PROPERTY_OPTIONS } from '../../constants/rulesPropertiesAndOperations';
import { Condition } from '../../interfaces/CreateNewRuleOrderTest';
import assertList from '../utils/assertList';
import { getById } from '../utils/getById';
import logger from '../utils/logger';

export async function selectCondition(page: Page, condition: Condition) {
    logger.info(' Start couriersRulesSteps.ts selectCondition', condition);

    const property = page.getByRole('combobox').nth(2); //getByAttribute(page, 'attr', 'property_id');
    await property.click();
    await assertList(page, PROPERTY_OPTIONS);

    const propertyLocator = page.getByText(condition.property);
    await propertyLocator.last().click();

    const operator = page.getByRole('combobox').nth(3); //getByAttribute(page, 'attr', 'operator_id');
    await operator.click();
    await assertList(page, OPERATOR_OPTIONS);

    const operationLocators = page.getByText(condition.operation);
    await operationLocators.last().click();

    const value = getById(page, 'value');
    await value.click();
    await value.fill(condition.value);

    const addCondition = page.getByText('Añadir condición');
    await addCondition.click();

    logger.info(' Finish couriersRulesSteps.ts selectCondition', condition);
}
