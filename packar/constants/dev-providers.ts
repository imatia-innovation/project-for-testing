import Provider from '../interfaces/Provider';

export const OPEN_PRICING_SERVICE_NAME_STANDARD = process.env.ENVIRONMENT === 'dev' ? 'Estándar' : 'Standard';
export interface ProviderServices {
    name: string;
    services: string[];
}

export const DEV_PROVIDER_SERVICES: ProviderServices[] = [
    // ----------------------------------- NO TRAD --------------------------------
    {
        name: 'GLS', // 0
        services: ['Estándar 24H', 'Estándar devoluciones en tienda'],
    },
    {
        name: 'NARVAL',
        services: ['REFRIGERADO', 'CONGELADO', 'MIXTO', 'SECO'],
    },
    {
        name: 'SEUR',
        services: [
            'SEUR FRIO 13:30',
            'SEUR 48 Estándar (Baleares, Ceuta, Melilla, Madeira)',
            'Entrega Particular Estándar',
            'Entrega en Sábado',
        ],
    },
    {
        name: 'STEF',
        services: ['Fresco o Seco', 'Congelado'],
    },
    {
        name: 'CORREOS', // 4
        services: [
            ' PAQUETE ESTÁNDAR DOMICILIO ',
            ' PAQUETE ESTÁNDAR OFICINA ',
            ' PAQUETE ESTÁNDAR CITYPAQ ',
            ' PAQUETE LIGERO ',
            ' PAQUETE RETORNO ',
            ' PAQUETE RETORNO PREMIUM ',
            ' PAQUETE PREMIUM OFICINA ',
            ' PAQUETE PREMIUM DOMICILIO ',
        ],
    },
    // ------------------------------------ TRAD ---------------------------------
    {
        name: 'TRANSPORTES PACO', // 5
        services: ['Standard'],
    },
    {
        name: 'EMILIO SL', // 6
        services: ['Standard'],
    },
    {
        name: 'BAJO COTIZACIÓN', // 7
        services: [OPEN_PRICING_SERVICE_NAME_STANDARD],
    },
    {
        name: 'ENVIOS PEPITO', // 8
        services: ['Standard'],
    },
];

export function labelChangesByProvider(provider: string) {
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

export function getProviderService(
    name: string,
    index: number = 0,
    providerServices: ProviderServices[]
): Provider | undefined {
    const providerService = providerServices.find((providerService) => providerService.name === name);

    if (providerService) {
        return {
            name,
            service: providerService.services[index],
        };
    }
}
