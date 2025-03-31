import { Page } from '@playwright/test';
import Provider from '../../interfaces/Provider';

export function labelChangesByProvider(provider: string) {
    switch (provider) {
        case 'GLS':
            return 'Tipo de servicio *';
        case 'NARVAL':
            return 'Mercancía *';
        case 'SEUR':
            return 'Tipo de servicio *';
        case 'STEF':
            return 'Categoría de Frío *';
    }

    return 'Tipo de servicio *';
}

export function labelChangesByProviderOrder(provider: string) {
    switch (provider) {
        case 'GLS':
            return 'Tipo de servicio';
        case 'NARVAL':
            return 'Mercancía';
        case 'SEUR':
            return 'Tipo de servicio';
        case 'STEF':
            return 'Categoría de Frío';
    }

    return 'Tipo de servicio *';
}
