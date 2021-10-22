import { isInteger } from '../../lib/check';
import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, getMonthNamesForLocale } from '../helpers';

export function generateFinancialJulyPeriodsUpToYear(year = getCurrentYear(), numberOfYears = 10, locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);
    if ((!isInteger(numberOfYears)) || numberOfYears < 1) {
        throw new Error('FinancialJuly generator parameter `numberOfYears` should be an integer larger than 0.');
    }

    const periods = [];
    const date = new Date(`30 Jun ${year + 1}`);
    const monthNames = getMonthNamesForLocale(locale);

    for (let i = 0; i < numberOfYears; i++) {
        const period = {};
        period.endDate = formatAsISODate(date);
        date.setYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        period.startDate = formatAsISODate(date);
        period.name = `${monthNames[6]} ${date.getFullYear()} - ${monthNames[5]} ${date.getFullYear() + 1}`;
        period.id = `${date.getFullYear()}July`;
        periods.push(period);
        date.setDate(date.getDate() - 1);
    }

    // FinancialJuly periods are collected backwards.
    return periods.reverse();
}
