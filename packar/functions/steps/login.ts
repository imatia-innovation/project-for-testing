import { expect, Page } from '@playwright/test';
import { baserUrl } from '../../constants';
import User from '../../interfaces/User';
import assertList from '../utils/assertList';
import { getByAttribute } from '../utils/getByAttribute';
import { getById } from '../utils/getById';

const LOGIN_TEXTS: string[] = [
    'Inicia sesión en tu cuenta:',
    'Iniciar sesión',
    'Creado por Imatia',
    '© 2024.',
    'Todos los derechos reservados',
];

export default async function login(page: Page, user: User) {
    await page.goto(baserUrl + '/app/login');

    await fillLoginInputs(page, user);
}

export async function loginAfterLogout(page: Page, user: User) {
    await page.waitForURL(baserUrl + '/app/login?session-expired=false');

    await fillLoginInputs(page, user);
}

async function fillLoginInputs(page: Page, user: User) {
    const userSelector = getById(page, 'username');
    await userSelector.click();
    await userSelector.fill(user.username);

    const passwordInput = getById(page, 'password');
    await passwordInput.click();
    await passwordInput.fill(user.password);

    await page.getByText('Iniciar sesión').click();

    await page.waitForURL(baserUrl + '/app/main/home');
}

export async function loginPageAssertions(page: Page) {
    await assertList(page, LOGIN_TEXTS);

    const packarImage = await getByAttribute(page, 'src', 'assets/images/logo-packar-rosa-grande.png').count();

    expect(packarImage > 0).toBeTruthy();
}
