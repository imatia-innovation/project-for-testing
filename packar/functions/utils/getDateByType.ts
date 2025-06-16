import { DATE_TYPES } from '../../constants/dateTypes';
import { formatDate } from './formatDate';

export interface DateRange {
    startDate: string;
    endDate: string;
}

export function getDateByType(dateType: DATE_TYPES): DateRange {
    let startDate = '';
    let endDate = '';

    let start: Date;
    let end: Date;

    const now = new Date();

    const year = now.getFullYear();

    switch (dateType) {
        case DATE_TYPES.MONTH:
            start = new Date(year, now.getMonth(), 1);
            end = new Date(year, now.getMonth() + 1, 0);
            startDate = formatDate(start);
            endDate = formatDate(end);
            break;
        case DATE_TYPES.WEEK:
            const dayOfWeek: number = now.getDay();
            const diffToMonday = (dayOfWeek + 6) % 7;
            const monday = new Date(now);
            monday.setDate(now.getDate() - diffToMonday);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            startDate = formatDate(monday);
            endDate = formatDate(sunday);
            break;
        case DATE_TYPES.TODAY:
            start = new Date(year, now.getMonth(), now.getDate(), 0, 0);
            end = new Date(year, now.getMonth(), now.getDate(), 23, 59);
            startDate = formatDate(start);
            endDate = formatDate(end);
            break;
        case DATE_TYPES.YEAR:
            start = new Date(year, 0, 1);
            end = new Date(year, 11, 31);
            startDate = formatDate(start);
            endDate = formatDate(end);
            break;
        default:
            break;
    }

    return {
        startDate,
        endDate,
    };
}
