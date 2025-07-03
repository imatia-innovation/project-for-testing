import test from '@playwright/test';
import { admin } from '../constants';
import { DATE_TYPES } from '../constants/dateTypes';
import login from '../functions/steps/login';
import {
    navigateToCreateNewReportForm,
    navigateToReportsGeneratedPage,
    navigateToReportsPage,
} from '../functions/steps/reportsSteps';
import assertList from '../functions/utils/assertList';
import { clickOnText } from '../functions/utils/clickOnText';
import { formatDate } from '../functions/utils/formatDate';
import { getByAttribute } from '../functions/utils/getByAttribute';
import { getById } from '../functions/utils/getById';
import { getByIdAndFill } from '../functions/utils/getByIdAndFill';
import { getDateByType } from '../functions/utils/getDateByType';
import { waitForTimeout } from '../functions/utils/waitforTimeout';
import { waitUntilUrlLoads } from '../functions/utils/waitUntilUrlLoads';
import ReportTest from '../interfaces/ReportTest';

test('should go to Reports page and make text assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToReportsPage(page);
});

test('should go to Reports generated page and make text assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToReportsGeneratedPage(page);
});

test('should go to Reports, open the create new form and make text assertions', async ({ page }) => {
    await login(page, admin);

    await navigateToCreateNewReportForm(page);
});

const report1: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.MONTH),
    type: 'Informe general',
    name: 'atest-mes',
    description: 'this is an automatic test',
};

const report2: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.WEEK),
    type: 'Informe general',
    name: 'atest-semana',
    description: 'this is an automatic test',
};

const report3: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.YEAR),
    type: 'Informe general',
    name: 'atest-año',
    description: 'this is an automatic test',
};

const report4: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.TODAY),
    type: 'Informe general',
    name: 'atest-día',
    description: 'this is an automatic test',
};

const report5: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.MONTH),
    type: 'Informe de incidencias',
    name: 'atest-mes',
    description: 'this is an automatic test',
};

const report6: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.WEEK),
    type: 'Informe de incidencias',
    name: 'atest-semana',
    description: 'this is an automatic test',
};

const report7: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.YEAR),
    type: 'Informe de incidencias',
    name: 'atest-año',
    description: 'this is an automatic test',
};

const report8: ReportTest = {
    testTitle: 'create new report {{report_type}} with date {{start_date}} - {{end_date}}',
    dateRange: getDateByType(DATE_TYPES.TODAY),
    type: 'Informe de incidencias',
    name: 'atest-día',
    description: 'this is an automatic test',
};

const reportsTest: ReportTest[] = [report1, report2, report3, report4, report5, report6, report7, report8];

reportsTest.forEach((report) => {
    const now: Date = new Date();

    const name: string = report.name + '-' + now.getTime().toString();

    const title = report.testTitle
        .replace('{{report_type}}', report.type)
        .replace('{{start_date}}', report.dateRange.startDate)
        .replace('{{end_date}}', report.dateRange.endDatePlusOne);

    test(title, async ({ page }) => {
        await login(page, admin);
        await waitForTimeout(page);

        await navigateToCreateNewReportForm(page);

        await getByIdAndFill(page, 'name', name);

        await getById(page, 'type').click();
        await clickOnText(page, ' ' + report.type + ' ');

        await getByIdAndFill(page, 'description', report.description);

        await getByAttribute(page, 'placeholder', 'Fecha inicio').fill(report.dateRange.startDate);

        await getByAttribute(page, 'placeholder', 'Fecha fin').fill(report.dateRange.endDate);
        await waitForTimeout(page);

        await clickOnText(page, 'Guardar');
        await waitForTimeout(page);

        await waitUntilUrlLoads(page, '/app/main/reports');
        await waitForTimeout(page);

        await navigateToReportsGeneratedPage(page);

        await clickOnText(page, 'Fecha del informe');

        await waitForTimeout(page, 2);

        await assertList(page, [
            formatDate(now),
            name,
            report.description,
            report.dateRange.startDate,
            report.dateRange.endDatePlusOne, //report.dateRange.endDate,
            report.type,
        ]);
    });
});
