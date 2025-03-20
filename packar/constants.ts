import 'dotenv/config';
import User from './interfaces/User';

export const admin: User = {
    username: process.env.USER_ADMIN_NAME!,
    password: process.env.USER_ADMIN_PASS!,
};

export const demo: User = {
    username: process.env.USER_DEMO_NAME!,
    password: process.env.USER_DEMO_PASS!,
};

export const baserUrl: string = process.env.BASE_URL!;

export const coreBaseUrl: string = process.env.CORE_BASE_URL!;
