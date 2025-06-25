export interface EntityTestCase {
    title: string;
    name: string;
    attributes: {
        repeatTimes: number;
        position: number;
    };
    tables: {
        repeatTimes: number;
        position: number;
    };
}
