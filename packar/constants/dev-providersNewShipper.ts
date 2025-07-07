export interface ProviderServices {
    name: string;
    services: string[];
}

export const DEV_PROVIDER_SERVICES_NEW_SHIPPER: ProviderServices[] = [
    {
        name: 'STEF', // 0
        services: [
            // 'Fresco o Seco',
            'Congelado',
        ],
    },
    {
        name: 'BAJO COTIZACIÓN', // 1
        services: ['Estándar'],
    },
    {
        name: 'ENVIOS PEPITO', // 2
        services: ['Standard'],
    },
];
