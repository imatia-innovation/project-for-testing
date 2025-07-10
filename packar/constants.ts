import 'dotenv/config';
import { DEV_PROVIDER_SERVICES, ProviderServices } from './constants/dev-providers';
import { DEV_PROVIDER_SERVICES_NEW_SHIPPER } from './constants/dev-providersNewShipper';
import { PRE_PROVIDER_SERVICES } from './constants/pre-providers';
import { PRE_PROVIDER_SERVICES_NEW_SHIPPER } from './constants/pre-providersNewShipper';
import User, { CourierDrivers } from './interfaces/User';

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
    drivers: process.env.USER_COURIER_DRIVERS!,
};

export const courierNOFixedPrice: User = {
    username: process.env.USER_COURIER_NAME_NO_FIXED_PRICE!,
    providerName: process.env.USER_COURIER_PROVIDER_NAME_NO_FIXED_PRICE!,
    password: process.env.USER_COURIER_PASS_NO_FIXED_PRICE!,
    drivers: process.env.USER_COURIER_NO_FIXED_PRICE_DRIVERS!,
};

export const courierFixedPrice: User = {
    username: process.env.USER_COURIER_NAME_FIXED_PRICE!,
    providerName: process.env.USER_COURIER_PROVIDER_NAME_FIXED_PRICE!,
    password: process.env.USER_COURIER_PASS_FIXED_PRICE!,
    drivers: process.env.USER_COURIER_FIXED_PRICE_DRIVERS!,
};

export const baserUrl: string = process.env.BASE_URL!;

export const coreBaseUrl: string = process.env.CORE_BASE_URL!;

export const PICKUP_LOCATION: string = process.env.PICKUP_LOCATION!;
export const DESTINATION_FAVORITE: string = process.env.DESTINATION_FAVORITE!;
export const PICKUP_LOCATION_SECONDARY: string = process.env.PICKUP_LOCATION_SECONDARY!;

export const TIMEOUT = process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 1000;

export const TEST_NEW_SHIPPER = Boolean(process.env.TEST_NEW_SHIPPER);

function setProviderServices(): ProviderServices[] {
    if (TEST_NEW_SHIPPER) {
        if (process.env.ENVIRONMENT === 'pre') {
            return PRE_PROVIDER_SERVICES_NEW_SHIPPER;
        } else {
            return DEV_PROVIDER_SERVICES_NEW_SHIPPER;
        }
    } else {
        if (process.env.ENVIRONMENT === 'pre') {
            return PRE_PROVIDER_SERVICES;
        } else {
            return DEV_PROVIDER_SERVICES;
        }
    }
}

export let PROVIDER_SERVICES: ProviderServices[] = setProviderServices();

export const courierOtherDrivers: CourierDrivers = JSON.parse(process.env.USER_COURIER_DRIVERS!);
export const courierNOFixedPriceDrivers: CourierDrivers = JSON.parse(process.env.USER_COURIER_NO_FIXED_PRICE_DRIVERS!);
export const courierFixedPriceDrivers: CourierDrivers = JSON.parse(process.env.USER_COURIER_FIXED_PRICE_DRIVERS!);

export const DEFAULT_NO_TRADITIONAL_COURIER = {
    provider: process.env.DEFAULT_NO_TRADITIONAL_COURIER!,
    service: process.env.DEFAULT_NO_TRADITIONAL_SERVICE!,
};
