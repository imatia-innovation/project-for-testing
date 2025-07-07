import 'dotenv/config';
import User from './interfaces/User';

export const USER_ONE: User = {
    credentials: {
        email: process.env.USER_ONE_EMAIL!,
        pass: process.env.USER_ONE_PASS!,
        role: process.env.USER_ONE_ROLE!,
    },
    tenants: JSON.parse(process.env.USER_ONE_TENANTS!),
    mainTenant: process.env.USER_ONE_MAIN_TENANT!,
    displayName: process.env.USER_ONE_DISPLAY_NAME!,
};

export const USER_DS_ADMIN: User = {
    credentials: {
        email: process.env.USER_DS_ADMIN_EMAIL!,
        pass: process.env.USER_DS_ADMIN_PASS!,
        role: process.env.USER_DS_ADMIN_ROLE!,
    },
    tenants: JSON.parse(process.env.USER_DS_ADMIN_TENANTS!),
    mainTenant: process.env.USER_DS_ADMIN_MAIN_TENANT!,
    displayName: process.env.USER_DS_ADMIN_DISPLAY_NAME!,
};

export const USER_IMATIA_ADMIN: User = {
    credentials: {
        email: process.env.USER_IMATIA_ADMIN_EMAIL!,
        pass: process.env.USER_IMATIA_ADMIN_PASS!,
        role: process.env.USER_IMATIA_ADMIN_ROLE!,
    },
    tenants: JSON.parse(process.env.USER_IMATIA_ADMIN_TENANTS!),
    mainTenant: process.env.USER_IMATIA_ADMIN_MAIN_TENANT!,
    displayName: process.env.USER_IMATIA_ADMIN_DISPLAY_NAME!,
};

export const baserUrl: string = process.env.BASE_URL!;

export const TIMEOUT = process.env.ENVIRONMENT === 'dev' ? 1000 : 1400;
