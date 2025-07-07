export interface Condition {
    property: string;
    operation: string;
    value: string;
}

export default interface CreateNewRuleOrderTest {
    testTitle: string;
    provider: string;
    service: number;
    priority: string;
    conditions: Condition[];
}
