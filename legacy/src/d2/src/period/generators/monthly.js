import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, getYYYYMM } from '../helpers';

export function generateMonthlyPeriodsForYear(year = getCurrentYear(), locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);

    const periods = [];
    const date = new Date(`31 Dec ${year}`);

    while (date.getFullYear() === year) {
        const monthName = date.toLocaleDateString(locale, { month: 'long' });

        const period = {};
        period.endDate = formatAsISODate(date);
        date.setDate(1);
        period.startDate = formatAsISODate(date);
        period.name = `${monthName} ${date.getFullYear()}`;
        period.id = getYYYYMM(date);
        periods.push(period);
        date.setDate(0);
    }

    // Months are collected backwards. So we reverse to get the chronological order.
    return periods.reverse();
}
