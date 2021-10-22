import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, getMonthNamesForLocale } from '../helpers';

/**
 * Generate Quarterly periods for a year.
 *
 * This will generate four quarters for a given year. The generated quarterly periods looks as follows.
 *
 * {
 *   startDate: '2017-10-01',
 *   endDate: '2017-12-31',
 *   name: 'October - December 2017',
 *   id: '2017Q4',
 * }
 *
 * The id is an unofficial ISO 8601 style notation for quarters. The old period generator used to have
 * and `iso` field but as some of the notations are not official ISO 8601 notations this property has been removed.
 * In most cases the `id` property contained the same value so this can be used instead.
 *
 * @private
 *
 * @param {Integer} [year=new Date().getFullYear()] The year to generate the daily periods for.
 * @param {String} [locale='en-gb'] The locale to use when getting month names.
 */
export function generateQuarterlyPeriodsForYear(year = getCurrentYear(), locale = 'en-gb') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);

    const periods = [];
    const date = new Date(`31 Dec ${year}`);
    let quarter = 4;
    const monthNames = getMonthNamesForLocale(locale);

    while (date.getFullYear() === year) {
        const period = {};
        period.endDate = formatAsISODate(date);
        date.setDate(0);
        date.setDate(0);
        date.setDate(1);
        period.startDate = formatAsISODate(date);
        period.name = `${monthNames[date.getMonth()]} - ${monthNames[date.getMonth() + 2]} ${date.getFullYear()}`;
        period.id = `${year}Q${quarter}`;
        periods.push(period);
        date.setDate(0);
        quarter -= 1;
    }

    // Quarters are collected backwards. So we reverse to get the chronological order.
    return periods.reverse();
}
