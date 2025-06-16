import { OPEN_PRICING_SERVICE_NAME_STANDARD, ProviderServices } from './dev-providers';

export const PRE_PROVIDER_SERVICES: ProviderServices[] = [
    // ----------------------------------- NO TRAD --------------------------------
    {
        name: 'GLS', // 0
        services: ['Estándar 24H', 'Estándar devoluciones en tienda'],
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
        name: 'CORREOS',
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
    {
        name: 'TIPSA',
        services: [' PICKUP '],
    },
    {
        name: 'NARVAL',
        services: ['REFRIGERADO', 'CONGELADO', 'MIXTO', 'SECO'],
    },
    {
        name: 'STEF',
        services: ['Fresco o Seco', 'Congelado'],
    },
    {
        name: 'MRW', // 6
        services: ['Urgente 10', 'Urgente 12', 'Urgente 14', 'Urgente 19'],
    },
    // ------------------------------------ TRAD ---------------------------------
    {
        name: 'EMILIO SL', // 7
        services: ['Standard'],
    },
    {
        name: 'TRANSPORTES PACO', // 8
        services: ['Standard'],
    },
    {
        name: 'BAJO COTIZACIÓN', // 9
        services: [OPEN_PRICING_SERVICE_NAME_STANDARD],
    },
    {
        name: 'DANIEL IGLESIA', // 10
        services: ['Standard'],
    },
    {
        name: 'LAPUENTE', // 11
        services: ['Standard'],
    },
    {
        name: 'AUTOS BREA', // 12
        services: [' Test de servicio de transportista tradicional '],
    },
    {
        name: 'TRANSPORTES CORUÑA', // 13
        services: ['Standar'],
    },
];
