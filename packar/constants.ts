import 'dotenv/config';
import { DEV_PROVIDER_SERVICES } from './constants/dev-providers';
import { PRE_PROVIDER_SERVICES } from './constants/pre-providers';
import User from './interfaces/User';

export const admin: User = {
    username: process.env.USER_ADMIN_NAME!,
    password: process.env.USER_ADMIN_PASS!,
};

export const demo: User = {
    username: process.env.USER_DEMO_NAME!,
    password: process.env.USER_DEMO_PASS!,
};

export const courierOther: User = {
    username: process.env.USER_COURIER_NAME!,
    providerName: process.env.USER_COURIER_PROVIDER_NAME!,
    password: process.env.USER_COURIER_PASS!,
};

export const courierNOFixedPrice: User = {
    username: process.env.USER_COURIER_NAME_NO_FIXED_PRICE!,
    providerName: process.env.USER_COURIER_PROVIDER_NAME_NO_FIXED_PRICE!,
    password: process.env.USER_COURIER_PASS_NO_FIXED_PRICE!,
};

export const courierFixedPrice: User = {
    username: process.env.USER_COURIER_NAME_FIXED_PRICE!,
    providerName: process.env.USER_COURIER_PROVIDER_NAME_FIXED_PRICE!,
    password: process.env.USER_COURIER_PASS_FIXED_PRICE!,
};

export const baserUrl: string = process.env.BASE_URL!;

export const coreBaseUrl: string = process.env.CORE_BASE_URL!;

export const PICKUP_LOCATION: string = process.env.PICKUP_LOCATION!;
export const DESTINATION_FAVORITE: string = process.env.DESTINATION_FAVORITE!;
export const PICKUP_LOCATION_SECONDARY: string = process.env.PICKUP_LOCATION_SECONDARY!;

export const TIMEOUT = process.env.ENVIRONMENT === 'dev' ? 800 : 1400;

export const PROVIDER_SERVICES = process.env.ENVIRONMENT === 'pre' ? PRE_PROVIDER_SERVICES : DEV_PROVIDER_SERVICES;
