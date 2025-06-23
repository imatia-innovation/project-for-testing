import 'dotenv/config';
import User from './interfaces/User';

export const user_main: User = {
    credentials: {
        email: process.env.USER_ONE_EMAIL!,
        pass: process.env.USER_MAIN_PASS!,
        rol: process.env.USER_MAIN_ROL!,
    },
    tenants: JSON.parse(process.env.USER_MAIN_TENANTS!),
    mainTenant: process.env.USER_MAIN_MAIN_TENANT!,
};

export const baserUrl: string = process.env.BASE_URL!;

export const TIMEOUT = process.env.ENVIRONMENT === 'dev' ? 800 : 1400;

