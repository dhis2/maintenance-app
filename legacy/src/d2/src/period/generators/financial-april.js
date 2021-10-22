import { isInteger } from '../../lib/check';
import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, getMonthNamesForLocale } from '../helpers';

export function generateFinancialAprilPeriodsUpToYear(year = getCurrentYear(), numberOfYears = 10, locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);
    if ((!isInteger(numberOfYears)) || numberOfYears < 1) {
        throw new Error('FinancialApril generator parameter `numberOfYears` should be an integer larger than 0.');
    }

    const periods = [];
    const date = new Date(year + 1, 2, 31);
    const monthNames = getMonthNamesForLocale(locale);

    for (let i = 0; i < numberOfYears; i++) {
        const period = {};
        period.endDate = formatAsISODate(date);
        date.setYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        period.startDate = formatAsISODate(date);
        period.name = `${monthNames[3]} ${date.getFullYear()} - ${monthNames[2]} ${date.getFullYear() + 1}`;
        period.id = `${date.getFullYear()}April`;
        periods.push(period);
        date.setDate(date.getDate() - 1);
    }

    // FinancialApril periods are collected backwards.
    return periods.reverse();
}
