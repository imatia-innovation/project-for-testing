import test from '@playwright/test';
import { admin } from '../constants';
import { assertNewDestinationForm, navigateToDestinationsPage } from '../functions/steps/destinationsSteps';
import login from '../functions/steps/login';
import assertList from '../functions/utils/assertList';
import { clickOnText } from '../functions/utils/clickOnText';
import { getByIdAndFill } from '../functions/utils/getByIdAndFill';
import { waitForTimeout } from '../functions/utils/waitforTimeout';

test('should go to Destinations page and make text assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToDestinationsPage(page);
});

test('should open the create new destination form', async ({ page }) => {
    await login(page, admin);

    await navigateToDestinationsPage(page);

    await assertNewDestinationForm(page);
});

const destination1 = {
    testTitle: 'should open the create new destination form and try to save with the minimum fields',
    textFields: [
        {
            id: 'destinationName',
            value: 'test',
        },
        {
            id: 'addressName',
            value: 'test',
        },
        {
            id: 'email',
            value: 'test@example.com',
        },
        {
            id: 'street',
            value: 'test',
        },
        {
            id: 'zipCode',
            value: '27600',
        },
        {
            id: 'city',
            value: 'test',
        },
    ],
};

// TODO make more test cases with phone number and real data

const destinationTests = [destination1];

destinationTests.forEach((destination) => {
    test(destination.testTitle, async ({ page }) => {
        await login(page, admin);

        await navigateToDestinationsPage(page);

        await assertNewDestinationForm(page);

        for (let index = 0; index < destination.textFields.length; index++) {
            const textField = destination.textFields[index];
            await getByIdAndFill(page, textField.id, textField.value);
        }

        await clickOnText(page, 'Guardar');

        await waitForTimeout(page);

        await clickOnText(page, 'test');
        await clickOnText(page, 'Eliminar');
        await assertList(page, [
            'Confirmar',
            '¿Está seguro de que quiere borrar los items seleccionados?',
            'Cancelar',
            'Ok',
        ]);
        await clickOnText(page, 'Ok');

        await waitForTimeout(page);
    });
});
