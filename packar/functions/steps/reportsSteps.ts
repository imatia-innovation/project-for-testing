import { Page } from '@playwright/test';
import assertList from '../utils/assertList';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import { getById } from '../utils/getById';
import { clickOnText } from '../utils/clickOnText';

const REPORTS_PAGE: string[] = ['Informes generados', 'Nuevo informe'];

const GENERATED_REPORTS_PAGE: string[] = [
    'Inicio',
    'Informes',
    'Informes Disponibles',
    //
    'INFORMES DISPONIBLES',
    'Refrescar',
    'Eliminar',
    //
    'Fecha del informe',
    'Nombre',
    'Descripción',
    'Inicio',
    'Fin',
    'Tipo de informe',
    'Descargar',
];

const CREATE_NEW_REPORT_FORM: string[] = [
    'Crear informe',
    'Introduzca un nombre, tipo y descripción para crear un nuevo informe',
    'Nombre',
    'Tipo de informe',
    'Descripción',
    'Seleccione las fechas en las que quiere crear el informe',
    'Fecha inicio - Fecha fin',
    'Cancelar',
    'Guardar',
];

export async function navigateToReportsPage(page: Page) {
    const locator = getById(page, 'reports');
    await locator.click();

    await waitUntilUrlLoads(page, '/app/main/reports');

    await assertReportsPage(page);
}

export async function assertReportsPage(page: Page) {
    await assertList(page, REPORTS_PAGE);
}

export async function navigateToReportsGeneratedPage(page: Page) {
    await navigateToReportsPage(page);

    await clickOnText(page, 'Informes generados');

    await waitUntilUrlLoads(page, '/app/main/reports/generated');

    await assertGeneratedReportsPage(page);
}

export async function assertGeneratedReportsPage(page: Page) {
    await assertList(page, GENERATED_REPORTS_PAGE);
}

export async function navigateToCreateNewReportForm(page: Page) {
    await navigateToReportsPage(page);

    await clickOnText(page, 'Nuevo informe');

    await assertCreateNewReportForm(page);
}

export async function assertCreateNewReportForm(page: Page) {
    await assertList(page, CREATE_NEW_REPORT_FORM);
}
