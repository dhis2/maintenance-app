import { isInteger } from '../../lib/check';
import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, getMonthNamesForLocale } from '../helpers';

export function generateFinancialOctoberPeriodsUpToYear(year = getCurrentYear(), numberOfYears = 10, locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);
    if ((!isInteger(numberOfYears)) || numberOfYears < 1) {
        throw new Error('FinancialOctober generator parameter `numberOfYears` should be an integer larger than 0.');
    }

    const periods = [];
    const date = new Date(`30 Sep ${year + 1}`);
    const monthNames = getMonthNamesForLocale(locale);

    for (let i = 0; i < numberOfYears; i++) {
        const period = {};
        period.endDate = formatAsISODate(date);
        date.setYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        period.startDate = formatAsISODate(date);
        period.name = `${monthNames[9]} ${date.getFullYear()} - ${monthNames[8]} ${date.getFullYear() + 1}`;
        period.id = `${date.getFullYear()}Oct`;
        periods.push(period);
        date.setDate(date.getDate() - 1);
    }

    // FinancialOctober periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.
    return periods.reverse();
}
