export default interface Destination {
    favorite?: string;
    name: string;
    mail?: string;
    phone?: string;
    phoneSecondary?: string;
    address?: string;
    zipCode?: string;
    population?: string;
    country?: string;
    saveAsNew: boolean;
    remarks: string;
}
