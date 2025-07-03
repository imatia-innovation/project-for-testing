export default interface User {
    username: string;
    password: string;
    providerName?: string;
    drivers?: string;
}

export interface CourierDrivers {
    driverNames: string[];
    vehicleRegisters: string[];
}
