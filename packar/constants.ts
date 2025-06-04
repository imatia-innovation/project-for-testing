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

export const courier: User = {
    username: process.env.USER_COURIER_NAME!,
    password: process.env.USER_COURIER_PASS!,
};

export const courierNOFixedPrice: User = {
    username: process.env.USER_COURIER_NAME_NO_FIXED_PRICE!,
    password: process.env.USER_COURIER_PASS_NO_FIXED_PRICE!,
};

export const courierFixedPrice: User = {
    username: process.env.USER_COURIER_NAME_FIXED_PRICE!,
    password: process.env.USER_COURIER_PASS_FIXED_PRICE!,
};

export const baserUrl: string = process.env.BASE_URL!;

export const coreBaseUrl: string = process.env.CORE_BASE_URL!;

export const pickUpLocation: string = process.env.PICKUP_LOCATION!;
export const destination_favorite: string = process.env.DESTINATION_FAVORITE!;
