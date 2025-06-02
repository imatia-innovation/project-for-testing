import { Page } from '@playwright/test';
import Destination from './Destination';

export default interface CreateNewOrderTest {
    title: string;
    pickUpLocation: string;
    reference: string;
    provider?: string;
    service?: number;
    selectPackage: (page: Page) => Promise<void>;
    destination: Destination;
    limitPrice?: number;
    assignmentMethod?: string;
}
