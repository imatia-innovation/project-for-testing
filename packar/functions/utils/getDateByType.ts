import { DATE_TYPES } from '../../constants/dateTypes';
import { formatDate } from './formatDate';

export interface DateRange {
    startDate: string;
    endDate: string;
    endDatePlusOne: string;
}

export function getDateByType(dateType: DATE_TYPES): DateRange {
    let startDate = '';
    let endDate = '';
    let endDatePlusOne = '';

    let start: Date;
    let end: Date;
    let endPlusOne: Date;

    const now = new Date();

    const year = now.getFullYear();

    switch (dateType) {
        case DATE_TYPES.MONTH:
            start = new Date(year, now.getMonth(), 1);
            end = new Date(year, now.getMonth() + 1, 0);
            endPlusOne = new Date(year, now.getMonth() + 1, 1);

            startDate = formatDate(start);
            endDate = formatDate(end);
            endDatePlusOne = formatDate(endPlusOne);
            break;
        case DATE_TYPES.WEEK:
            const dayOfWeek: number = now.getDay();
            const diffToMonday = (dayOfWeek + 6) % 7;

            const monday = new Date(now);
            monday.setDate(now.getDate() - diffToMonday);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            const otherMonday = new Date(monday);
            otherMonday.setDate(monday.getDate() + 7);

            startDate = formatDate(monday);
            endDate = formatDate(sunday);
            endDatePlusOne = formatDate(otherMonday);

            break;
        case DATE_TYPES.TODAY:
            start = new Date(year, now.getMonth(), now.getDate(), 0, 0);
            end = new Date(year, now.getMonth(), now.getDate(), 23, 59);
            endPlusOne = new Date(year, now.getMonth(), now.getDate() + 1);

            startDate = formatDate(start);
            endDate = formatDate(end);
            endDatePlusOne = formatDate(endPlusOne);
            break;
        case DATE_TYPES.YEAR:
            start = new Date(year, 0, 1);
            end = new Date(year, 11, 31);
            endPlusOne = new Date(year + 1, 0, 1);
            startDate = formatDate(start);
            endDate = formatDate(end);
            endDatePlusOne = formatDate(endPlusOne);
            break;
        default:
            break;
    }

    return {
        startDate,
        endDate,
        endDatePlusOne,
    };
}
