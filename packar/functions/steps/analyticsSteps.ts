import { Page } from '@playwright/test';
import { admin } from '../../constants';
import assertList from '../utils/assertList';
import { getById } from '../utils/getById';
import { waitUntilUrlLoads } from '../utils/waitUntilUrlLoads';
import login from './login';

const ANALYTICS_PAGE: string[] = [
    'Inicio',
    'Análisis',
    //
    'Fecha',
    'Hoy',
    'Última semana',
    'Últimos 15 días',
    'Último mes',
    'Últimos 6 meses',
    'Último año',
    'Black Friday',
    //
    'Devoluciones',
    'Envíos',
    //
    'HISTÓRICO PEDIDOS FECHA ACTUAL',
    'CANTIDAD DE PEDIDOS POR TRANSPORTISTA',
    'CANTIDAD DE PEDIDOS POR CIUDAD',
    'PEDIDOS POR ESTADOS',
    'INFORMACIÓN BÁSICA',
    //
    'Localidad',
    'Transportista',
    'Estado del pedido',
    'Peso medio de los pedidos:',
    'Número de pedidos gestionados:',
];

export async function navigateToAnalyticsPage(page: Page) {
    await login(page, admin);

    const analyticsLocator = getById(page, 'analytics');
    await analyticsLocator.click();

    await waitUntilUrlLoads(page, '/app/main/analytics');

    await assertAnalyticsPage(page);
}

export async function assertAnalyticsPage(page: Page) {
    await assertList(page, ANALYTICS_PAGE);
}
