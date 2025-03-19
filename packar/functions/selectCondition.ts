import { Page } from '@playwright/test';
import assertElementsByText from './assertElementsByText';
import Calculator from '../classes/Calculator';

export default async function selectCondition(
    page: Page,
    propertyOptions: string[],
    operatorOptions: string[],
    calculator: Calculator,
    inputValue: string
) {
    const property = page.getByLabel('Propiedad *');
    await property.click();
    assertElementsByText(page, propertyOptions);

    const propertyLocator = page.getByText(propertyOptions[calculator.combination.i]);
    await propertyLocator.last().click();

    const operator = page.getByLabel('Operador *');
    await operator.click();
    assertElementsByText(page, operatorOptions);

    const operationLocators = page.getByText(operatorOptions[calculator.combination.j]);
    await operationLocators.last().click();

    const value = page.getByLabel('Valor *');
    await value.click();
    await value.fill(inputValue);

    const addCondition = page.getByText('Añadir condición');
    await addCondition.click();

    return calculator.setCombinationUsed();
}
