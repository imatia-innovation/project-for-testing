import { Page } from '@playwright/test';
import assertList from '../utils/assertList';

const SETTINGS_TEXTS = ['Settings', 'Language', 'Spanish', 'English', 'Dark Mode'];

const SETTINGS_TEXTS_ES = ['Configuración', 'Idioma', 'Inglés', 'Español', 'Modo Nocturno'];

export async function settingsAssertions(page: Page, Language: string = 'en') {
    if (Language === 'en') {
        await assertList(page, SETTINGS_TEXTS);
    } else {
        await assertList(page, SETTINGS_TEXTS_ES);
    }
}
