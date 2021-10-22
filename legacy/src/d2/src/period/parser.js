import {
    getMonthNamesForLocale,
    formatAsISODate,
    getLastDateOfMonth,
    getFirstDateOfQuarter,
    getLastDateOfQuarter,
    getFirstDateOfWeek,
    addDays,
} from './helpers';
import { toLocaleDayFormat } from './formatters';

const periodTypeRegex = {
    Daily: /^([0-9]{4})([0-9]{2})([0-9]{2})$/,          // YYYYMMDD
    Weekly: /^([0-9]{4})()W([0-9]{1,2})$/,              // YYYY"W"[1-53]
    WeeklyWednesday: /^([0-9]{4})(Wed)W([0-9]{1,2})$/,  // YYYY"WedW"[1-53]
    WeeklyThursday: /^([0-9]{4})(Thu)W([0-9]{1,2})$/,   // YYYY"ThuW"[1-53]
    WeeklySaturday: /^([0-9]{4})(Sat)W([0-9]{1,2})$/,   // YYYY"SatW"[1-53]
    WeeklySunday: /^([0-9]{4})(Sun)W([0-9]{1,2})$/,     // YYYY"SunW"[1-53]
    Monthly: /^([0-9]{4})([0-9]{2})$/,                  // YYYYMM
    BiMonthly: /^([0-9]{4})([0-9]{2})B$/,               // YYYY0[1-6]"B"
    Quarterly: /^([0-9]{4})Q([1234])$/,                 // YYYY"Q"[1-4]
    SixMonthly: /^([0-9]{4})S([12])$/,                  // YYYY"S"[1/2]
    SixMonthlyApril: /^([0-9]{4})AprilS([12])$/,        // YYYY"AprilS"[1/2]
    Yearly: /^([0-9]{4})$/,                             // YYYY
    FinancialApril: /^([0-9]{4})April$/,                // YYYY"April"
    FinancialJuly: /^([0-9]{4})July$/,                  // YYYY"July"
    FinancialOct: /^([0-9]{4})Oct$/,                    // YYYY"Oct"
};

/* eslint-disable complexity */
const weeklyMatcherParser = (match, locale = 'en') => {
    let year = parseInt(match[1], 10);
    const weekType = match[2];
    let week = parseInt(match[3], 10);
    if (week < 1 || week > 53) {
        throw new Error('Invalid week number');
    }

    const monthNames = getMonthNamesForLocale(locale);

    let weekTypeDiff = 0;
    switch (weekType) {
    case 'Wed': weekTypeDiff = 2; break;
    case 'Thu': weekTypeDiff = 3; break;
    case 'Sat': weekTypeDiff = -2; break;
    case 'Sun': weekTypeDiff = -1; break;
    default: break;
    }

    const startDate = addDays(weekTypeDiff, getFirstDateOfWeek(year, week));
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const startMonthName = monthNames[startMonth];
    const startDayNum = startDate.getDate();

    if (week === 53 && startYear !== year) {
        week = 1;
        year = startYear;
    }
    const id = `${year}${weekType}W${week}`;

    const endDate = addDays(6, startDate);
    const endMonth = endDate.getMonth();
    const endDayNum = endDate.getDate();
    const endMonthName = monthNames[endMonth];

    const name = startMonth === endMonth
        ? `${year} W${week} ${startMonthName} ${startDayNum} - ${endDayNum}`
        : `${year} W${week} ${startMonthName} ${startDayNum} - ${endMonthName} ${endDayNum}`;

    return {
        id,
        name,
        startDate: formatAsISODate(startDate),
        endDate: formatAsISODate(endDate),
    };
};

const isValidDailyPeriod = (month, year, day) =>
    month > 11 || month < 0 ||
    day > 31 || day < 1 ||
    year < 1000 || year > 5000;
/* eslint-enable */

const regexMatchToPeriod = {
    Daily: (match, locale = 'en') => {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = parseInt(match[3], 10);
        if (isValidDailyPeriod(month, year, day)) {
            throw new Error('Invalid Daily period');
        }
        const date = new Date(match[1], match[2] - 1, match[3]);
        return {
            id: `${date.getFullYear()}${(`0${date.getMonth() + 1}`).substr(-2)}${(`0${date.getDate()}`).substr(-2)}`,
            name: toLocaleDayFormat(date, locale),
            startDate: formatAsISODate(date),
            endDate: formatAsISODate(date),
        };
    },
    Weekly: weeklyMatcherParser,
    WeeklyWednesday: weeklyMatcherParser,
    WeeklyThursday: weeklyMatcherParser,
    WeeklySaturday: weeklyMatcherParser,
    WeeklySunday: weeklyMatcherParser,
    Monthly: (match, locale = 'en') => {
        const id = match[0];
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        if (month > 11 || month < 0) {
            throw new Error('Invalid month number');
        }
        const monthNum = `0${month + 1}`.substr(-2);
        const monthNames = getMonthNamesForLocale(locale);
        const lastDay = getLastDateOfMonth(year, month);
        return {
            id,
            name: `${monthNames[month]} ${year}`,
            startDate: `${year}-${monthNum}-01`,
            endDate: formatAsISODate(lastDay),
        };
    },
    BiMonthly: (match, locale = 'en') => {
        const id = match[0];
        const year = parseInt(match[1], 10);
        const biMonth = parseInt(match[2], 10);
        if (biMonth < 1 || biMonth > 6) {
            throw new Error('Invalid BiMonth number');
        }
        const startMonth = (biMonth - 1) * 2;
        const startMonthNum = `0${startMonth + 1}`.substr(-2);
        const endMonth = startMonth + 1;
        const monthNames = getMonthNamesForLocale(locale);
        return {
            id,
            name: `${monthNames[startMonth]} - ${monthNames[endMonth]} ${year}`,
            startDate: `${year}-${startMonthNum}-01`,
            endDate: formatAsISODate(getLastDateOfMonth(year, endMonth)),
        };
    },
    Quarterly: (match, locale = 'en') => {
        const id = match[0];
        const year = parseInt(match[1], 10);
        const quarter = parseInt(match[2], 10);
        const startMonth = (quarter - 1) * 3;
        const endMonth = (quarter * 3) - 1;
        const monthNames = getMonthNamesForLocale(locale);
        return {
            id,
            name: `${monthNames[startMonth]} - ${monthNames[endMonth]} ${year}`,
            startDate: formatAsISODate(getFirstDateOfQuarter(year, quarter)),
            endDate: formatAsISODate(getLastDateOfQuarter(year, quarter)),
        };
    },
    SixMonthly: (match, locale = 'en') => {
        const id = match[0];
        const year = match[1];
        const s = parseInt(match[2], 10) - 1;
        const startMonth = 6 * s;
        const endMonth = (6 * s) + 6;
        const endMonthNum = `0${endMonth}`.substr(-2);
        const monthNames = getMonthNamesForLocale(locale);
        return {
            id,
            name: `${monthNames[startMonth]} - ${monthNames[endMonth - 1]} ${year}`,
            startDate: `${year}-0${(startMonth + 1)}-01`,
            endDate: `${year}-${(endMonthNum)}-${s === 0 ? '30' : '31'}`,
        };
    },
    SixMonthlyApril: (match, locale = 'en') => {
        const id = match[0];
        const year = parseInt(match[1], 10);
        const s = parseInt(match[2], 10) - 1;
        const startMonth = s === 0 ? 4 : 10;
        const startMonthNum = `0${startMonth}`.substr(-2);
        const endMonth = s === 0 ? 9 : 3;
        const endMonthNum = `0${endMonth}`.substr(-2);
        const monthNames = getMonthNamesForLocale(locale);
        return {
            id,
            name: s === 0
                ? `${monthNames[startMonth - 1]} - ${monthNames[endMonth - 1]} ${year}`
                : `${monthNames[startMonth - 1]} ${year} - ${monthNames[endMonth - 1]} ${year + 1}`,
            startDate: `${year}-${(startMonthNum)}-01`,
            endDate: `${year + s}-${(endMonthNum)}-${s === 0 ? '30' : '31'}`,
        };
    },
    Yearly: match => ({
        id: match[0],
        name: match[1],
        startDate: `${match[1]}-01-01`,
        endDate: `${match[1]}-12-31`,
    }),
    FinancialApril: (match, locale = 'en') => {
        const year = parseInt(match[1], 10);
        const monthNames = getMonthNamesForLocale(locale);
        return {
            id: match[0],
            name: `${monthNames[3]} ${year} - ${monthNames[2]} ${year + 1}`,
            startDate: `${year}-04-01`,
            endDate: `${year + 1}-03-31`,
        };
    },
    FinancialJuly: (match, locale = 'en') => {
        const year = parseInt(match[1], 10);
        const monthNames = getMonthNamesForLocale(locale);
        return {
            id: match[0],
            name: `${monthNames[6]} ${year} - ${monthNames[5]} ${year + 1}`,
            startDate: `${year}-07-01`,
            endDate: `${year + 1}-06-30`,
        };
    },
    FinancialOct: (match, locale = 'en') => {
        const year = parseInt(match[1], 10);
        const monthNames = getMonthNamesForLocale(locale);
        return {
            id: match[0],
            name: `${monthNames[9]} ${year} - ${monthNames[8]} ${year + 1}`,
            startDate: `${year}-10-01`,
            endDate: `${year + 1}-09-30`,
        };
    },
};

export function getPeriodFromPeriodId(periodId, locale = 'en') {
    const period = Object.keys(periodTypeRegex)
        .filter(periodType => periodTypeRegex[periodType].test(periodId)
            && regexMatchToPeriod.hasOwnProperty(periodType),
        )
        .map(periodType => regexMatchToPeriod[periodType](periodId.match(periodTypeRegex[periodType]), locale))[0];

    if (!period) {
        throw new Error('Invalid period format');
    }

    return period;
}

export default getPeriodFromPeriodId;
