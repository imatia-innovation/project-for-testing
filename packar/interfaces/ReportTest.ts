import { DateRange } from '../functions/utils/getDateByType';

export default interface ReportTest {
    testTitle: string;
    dateRange: DateRange;
    type: string;
    name: string;
    description: string;
}
