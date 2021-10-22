import { validateIfValueIsInteger, getCurrentYear, getMonthNamesForLocale } from '../helpers';

export function generateSixMonthlyAprilPeriodsForYear(year = getCurrentYear(), locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);

    const monthNames = getMonthNamesForLocale(locale);
    const periods = [];

    let period = {};
    period.startDate = `${year}-04-01`;
    period.endDate = `${year}-09-30`;
    period.name = `${monthNames[3]} - ${monthNames[8]} ${year}`;
    period.iso = `${year}AprilS1`;
    period.id = period.iso;
    periods.push(period);

    period = {};
    period.startDate = `${year}-10-01`;
    period.endDate = `${year + 1}-03-31`;
    period.name = `${monthNames[9]} ${year} - ${monthNames[2]} ${year + 1}`;
    period.iso = `${year}AprilS2`;
    period.id = period.iso;
    periods.push(period);

    return periods;
}
