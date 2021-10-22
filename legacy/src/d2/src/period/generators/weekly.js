import {
    validateIfValueIsInteger,
    formatAsISODate,
    getCurrentYear,
    addDays,
    getFirstDayInFirstISOWeekForYear,
    getLastDayOfTheWeekForFirstDayOfTheWeek,
    is53WeekISOYear,
} from '../helpers';

/**
 * Generate weekly periods types
 *
 * @private
 *
 * @param {Integer} [year] The year to generate the weeks for.
 */
export function generateWeeklyPeriodsForYear(year = getCurrentYear()) { // eslint-disable-line import/prefer-default-export
    validateIfValueIsInteger(year);

    const periods = [];
    const weeksInYear = is53WeekISOYear(year) ? 53 : 52;
    let startDate = getFirstDayInFirstISOWeekForYear(year);

    for (let week = 1; week <= weeksInYear; week += 1) {
        const endDate = getLastDayOfTheWeekForFirstDayOfTheWeek(startDate);

        const period = {
            startDate: formatAsISODate(startDate),
            endDate: formatAsISODate(endDate),
            name: `W${week} - ${formatAsISODate(startDate)} - ${formatAsISODate(endDate)}`,
            id: `${year}W${week}`,
        };

        periods.push(period);

        // Go to the start of the next week +7 days
        startDate = addDays(7, startDate);
    }

    return periods;
}
