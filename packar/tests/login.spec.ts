import { test, expect } from '@playwright/test';

const baserUrl = process.env.BASE_URL;

test.afterEach(async ({ page }) => {
    page.close();
});

test('should go to login Page and send an invalid password', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');

    const selectorMessage = page.getByText('Inicia sesión en tu cuenta:');
    expect(selectorMessage).not.toBeNull();

    const selectorImage = await page.locator('img').getAttribute('src');
    expect(selectorImage).toEqual('assets/images/logo-packar-rosa-grande.png');

    const userSelector = page.getByLabel('Nombre de usuario');
    await userSelector.click();
    await userSelector.fill('user1');

    const passwordInput = page.getByLabel('Contraseña');
    await passwordInput.click();
    await passwordInput.fill('radompass123456');

    await page.getByText('Iniciar sesión').click();

    expect(page.getByText('Error')).not.toBeNull();
    expect(page.getByText('Error de inicio de sesión. Compruebe nombre de usuario y/o contraseña.')).not.toBeNull();

    await page.getByText('Ok').click();
});

test('should go to login Page, and make login successfully', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');

    const selectorMessage = page.getByText('Inicia sesión en tu cuenta:');
    expect(selectorMessage).not.toBeNull();

    const selectorImage = await page.locator('img').getAttribute('src');
    expect(selectorImage).toEqual('assets/images/logo-packar-rosa-grande.png');

    const userSelector = page.getByLabel('Nombre de usuario');
    await userSelector.click();
    await userSelector.fill(process.env.USER_ADMIN_NAME!);

    const passwordInput = page.getByLabel('Contraseña');
    await passwordInput.click();
    await passwordInput.fill(process.env.USER_ADMIN_PASS!);

    await page.getByText('Iniciar sesión').click();

    await page.waitForURL('/app/main/home');
    expect(page.url()).toContain('/app/main/home');
});
