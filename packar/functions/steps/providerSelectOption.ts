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
        case 'CORREOS':
            return 'Tipo de servicio *';
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
        case 'CORREOS':
            return 'Tipo de servicio';
    }

    return 'Tipo de servicio';
}
