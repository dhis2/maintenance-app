import { validateIfValueIsInteger, getCurrentYear, getMonthNamesForLocale } from '../helpers';

export function generateSixMonthlyPeriodsForYear(year = getCurrentYear(), locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);

    const monthNames = getMonthNamesForLocale(locale);

    return [
        {
            startDate: `${year}-01-01`,
            endDate: `${year}-06-30`,
            name: `${monthNames[0]} - ${monthNames[5]} ${year}`,
            id: `${year}S1`,
        },
        {
            startDate: `${year}-07-01`,
            endDate: `${year}-12-31`,
            name: `${monthNames[6]} - ${monthNames[11]} ${year}`,
            id: `${year}S2`,
        },
    ];
}
