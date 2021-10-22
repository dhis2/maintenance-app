import { isInteger } from '../lib/check';

export function formatAsISODate(date) {
    if (!(date instanceof Date)) {
        throw new Error('formatAsISODate(date) only accepts Date objects');
    }

    const y = date.getFullYear();
    const m = `0${date.getMonth() + 1}`.substr(-2);
    const d = `0${date.getDate()}`.substr(-2);
    return `${y}-${m}-${d}`;
}

export function filterFuturePeriods(periods) {
    const array = [];
    const now = new Date();

    for (let i = 0; i < periods.length; i++) {
        if (new Date(periods[i].startDate) <= now) {
            array.push(periods[i]);
        }
    }

    return array;
}

export function getYYYYMM(date) {
    const y = date.getFullYear();
    let m = `${date.getMonth() + 1}`;
    m = `0${m}`.substr(-2);
    return y + m;
}

export function getBiMonthlyId(date) {
    const y = date.getFullYear();
    const m = `0${Math.floor(date.getMonth() / 2) + 1}`.substr(-2);
    return `${y + m}B`;
}

export function validateIfValueIsInteger(year) {
    if (!isInteger(year)) {
        throw new Error(
            'Generator should be called with an integer to identify the year.' +
            ' Perhaps you passed a Date object?',
        );
    }

    if (year < 0) {
        throw new Error('Generator does not support generating year before the year 0.');
    }
}

export function getCurrentYear() {
    return new Date().getFullYear();
}

export function is53WeekISOYear(year) {
    const p = y => ((y + Math.floor(y / 4)) - Math.floor(y / 100)) + Math.floor(y / 400);

    return p(year) % 7 === 4 || p(year - 1) % 7 === 3;
}

export function addDays(days, date) {
    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
}

export function addMonths(months, date) {
    const result = new Date(date);

    result.setMonth(date.getMonth() + months);

    return result;
}

export function subtractDays(days, date) {
    return addDays(-days, date);
}

export function getFirstDayInFirstISOWeekForYear(year) {
    // The first ISO week of the year always contains 4th January. We can use this as a pointer to start the first week.
    let startDate = new Date(year, 0, 4);

    // January 4th might not be at the start of the week. Therefore we rewind to the start of the week.
    if (startDate.getDay() === 0) {
        startDate = subtractDays(6, startDate);
        // If January 4th is on a Sunday we'll revert back 6 days
    } else {
        // We'll revert back the current day number of days - 1 (Due to the days being 0 indexed with 0 being Sunday)
        const daysAfterMonday = startDate.getDay() - 1;
        startDate = subtractDays(daysAfterMonday, startDate);
    }

    return startDate;
}

export function getLastDayOfTheWeekForFirstDayOfTheWeek(startDate) {
    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 6);

    return endDate;
}

export function getMonthNamesForLocale(locale) {
    const monthNames = [];

    for (let i = 0; i < 12; i += 1) {
        const monthName = new Date(2000, i, 1).toLocaleDateString(locale, { month: 'long' });
        monthNames.push(monthName);
    }

    return monthNames;
}

export function getLastDateOfMonth(year, month) {
    return new Date(new Date(year, month + 1).setDate(0));
}

export function getFirstDateOfQuarter(year, quarter) {
    const startMonth = (quarter - 1) * 3;
    return new Date(year, startMonth);
}

export function getLastDateOfQuarter(year, quarter) {
    return new Date(getFirstDateOfQuarter(year, quarter + 1).setDate(0));
}

const ordTable = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const ordTableLeap = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

export function getFirstDateOfWeek(year, week) {
    const isLeapYear = new Date(new Date(year, 2, 1).setDate(0)).getDate() === 29;
    const ordDiff = isLeapYear ? ordTableLeap : ordTable;

    const correction = ((new Date(year, 0, 4)).getDay() || 7) + 3;
    const ordDate = (week * 7) + (1 - correction);
    if (ordDate < 0) {
        return new Date(year, 0, ordDate);
    }

    let month = 11;
    while (ordDate < ordDiff[month]) {
        month--; // eslint-disable-line
    }

    return new Date(year, month, ordDate - ordDiff[month]);
}
