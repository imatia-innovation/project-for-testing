export interface ProviderServices {
    name: string;
    services: string[];
}

export const PRE_PROVIDER_SERVICES_NEW_SHIPPER: ProviderServices[] = [
    {
        name: 'MRW', // 0
        services: ['Urgente 10', 'Urgente 12', 'Urgente 14', 'Urgente 19'],
    },
    {
        name: 'BAJO COTIZACIÓN', // 1
        services: ['Estándar'],
    },
    {
        name: 'AUTOS BREA', // 2
        services: ['Test de servicio de transportista tradicional'],
    },
];
