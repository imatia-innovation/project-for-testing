import { Page } from '@playwright/test';
import { baserUrl } from '../../constants';
import User from '../../interfaces/User';

export default async function login(page: Page, user: User) {
    await page.goto(baserUrl + '/app/login');

    const userSelector = page.getByLabel('Nombre de usuario');
    await userSelector.click();
    await userSelector.fill(user.username);

    const passwordInput = page.getByLabel('Contraseña');
    await passwordInput.click();
    await passwordInput.fill(user.password);

    await page.getByText('Iniciar sesión').click();

    await page.waitForURL(baserUrl + '/app/main/home');
}
