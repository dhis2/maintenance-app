import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, addDays } from '../helpers';
import { toLocaleDayFormat } from '../formatters';

/**
 * Generate daily periods for the given year.
 *
 * @private
 * @param {Integer} [year=getCurrentYear()] The year to generate the daily periods for.
 */
export function generateDailyPeriodsForYear(year = getCurrentYear(), locale = 'en') { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);

    const periods = [];
    let date = new Date(year, 0, 1);

    // As long as we are within the current year create daily periods
    while (date.getFullYear() === year) {
        const formattedDate = formatAsISODate(date);

        const period = {
            startDate: formattedDate,
            endDate: formattedDate,
            name: toLocaleDayFormat(date, locale),
            id: formattedDate.replace(/-/g, ''),
        };

        periods.push(period);

        // Advance to the next day
        // date.setDate(date.getDate() + 1);
        date = addDays(1, date);
    }

    return periods;
}
