export interface Tenant {
    id: string;
    name: string;
}

export default interface User {
    credentials: {
        email: string;
        pass: string;
        role: string;
    };
    tenants: Tenant[];
    mainTenant: string;
    displayName: string;
}
