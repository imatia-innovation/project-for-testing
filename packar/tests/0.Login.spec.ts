import { test, expect } from '@playwright/test';
import { admin, baserUrl, demo, courier } from '../constants';
import { getById } from '../functions/utils/getById';
import logout from '../functions/steps/logout';
import { loginPageAssertions } from '../functions/steps/login';

test.afterEach(async ({ page }) => {
    page.close();
});

test('should go to login Page and send an invalid password', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');

    const selectorMessage = page.getByText('Inicia sesión en tu cuenta:');
    expect(selectorMessage).not.toBeNull();

    const selectorImage = await page.locator('img').getAttribute('src');
    expect(selectorImage).toEqual('assets/images/logo-packar-rosa-grande.png');

    const userSelector = getById(page, 'username');
    await userSelector.click();
    await userSelector.fill('user1');

    const passwordInput = getById(page, 'password');
    await passwordInput.click();
    await passwordInput.fill('radompass123456');

    await page.getByText('Iniciar sesión').click();

    expect(page.getByText('Error')).not.toBeNull();
    expect(page.getByText('Error de inicio de sesión. Compruebe nombre de usuario y/o contraseña.')).not.toBeNull();

    await page.getByText('Ok').click();
});

test('should go to login Page, and make login successfully with admin user and logout', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');

    const selectorMessage = page.getByText('Inicia sesión en tu cuenta:');
    expect(selectorMessage).not.toBeNull();

    const selectorImage = await page.locator('img').getAttribute('src');
    expect(selectorImage).toEqual('assets/images/logo-packar-rosa-grande.png');

    const userSelector = getById(page, 'username');
    await userSelector.click();
    await userSelector.fill(admin.username);

    const passwordInput = getById(page, 'password');
    await passwordInput.click();
    await passwordInput.fill(admin.password);

    await page.getByText('Iniciar sesión').click();

    await page.waitForURL(baserUrl + '/app/main/home');
    expect(page.url()).toContain('/app/main/home');

    await logout(page);

    await page.waitForURL(baserUrl + '/app/login?session-expired=false');
    expect(page.url()).toContain('/app/login?session-expired=false');

    await loginPageAssertions(page);
});

test('should go to login Page, and make login successfully with demo user and logout', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');

    const selectorMessage = page.getByText('Inicia sesión en tu cuenta:');
    expect(selectorMessage).not.toBeNull();

    const selectorImage = await page.locator('img').getAttribute('src');
    expect(selectorImage).toEqual('assets/images/logo-packar-rosa-grande.png');

    const userSelector = getById(page, 'username');
    await userSelector.click();
    await userSelector.fill(demo.username);

    const passwordInput = getById(page, 'password');
    await passwordInput.click();
    await passwordInput.fill(demo.password);

    await page.getByText('Iniciar sesión').click();

    await page.waitForURL(baserUrl + '/app/main/home');
    expect(page.url()).toContain('/app/main/home');

    await logout(page);

    await page.waitForURL(baserUrl + '/app/login?session-expired=false');
    expect(page.url()).toContain('/app/login?session-expired=false');

    await loginPageAssertions(page);
});

test('should go to login Page, and make login successfully with courier user and logout', async ({ page }) => {
    await page.goto(baserUrl + '/app/login');

    const selectorMessage = page.getByText('Inicia sesión en tu cuenta:');
    expect(selectorMessage).not.toBeNull();

    const selectorImage = await page.locator('img').getAttribute('src');
    expect(selectorImage).toEqual('assets/images/logo-packar-rosa-grande.png');

    const userSelector = getById(page, 'username');
    await userSelector.click();
    await userSelector.fill(courier.username);

    const passwordInput = getById(page, 'password');
    await passwordInput.click();
    await passwordInput.fill(courier.password);

    await page.getByText('Iniciar sesión').click();

    await page.waitForURL(baserUrl + '/app/main/home');
    expect(page.url()).toContain('/app/main/home');

    await logout(page);

    await page.waitForURL(baserUrl + '/app/login?session-expired=false');
    expect(page.url()).toContain('/app/login?session-expired=false');

    await loginPageAssertions(page);
});
