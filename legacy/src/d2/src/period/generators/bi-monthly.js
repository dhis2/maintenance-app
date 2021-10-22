import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, addMonths, getBiMonthlyId } from '../helpers';

export function generateBiMonthlyPeriodsForYear(year = getCurrentYear(), locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);

    const periods = [];
    const date = new Date(`31 Dec ${year}`);

    while (date.getFullYear() === year) {
        const period = {};
        period.endDate = formatAsISODate(date);
        date.setDate(0);
        date.setDate(1);

        const firstMonth = date.toLocaleDateString(locale, { month: 'long' });
        const lastMonth = addMonths(1, date).toLocaleDateString(locale, { month: 'long' });

        period.startDate = formatAsISODate(date);
        period.name = `${firstMonth} - ${lastMonth} ${date.getFullYear()}`;
        period.id = getBiMonthlyId(date);
        periods.push(period);
        date.setDate(0);
    }

    // Bi-months are collected backwards. So we reverse to get the chronological order.
    return periods.reverse();
}
