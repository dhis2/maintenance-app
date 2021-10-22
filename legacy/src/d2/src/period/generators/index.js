/**
 * @module period/generators
 */

import { generateDailyPeriodsForYear } from './daily';
import { generateWeeklyPeriodsForYear } from './weekly';
import { generateMonthlyPeriodsForYear } from './monthly';
import { generateBiMonthlyPeriodsForYear } from './bi-monthly';
import { generateQuarterlyPeriodsForYear } from './quarterly';
import { generateSixMonthlyPeriodsForYear } from './six-monthly';
import { generateSixMonthlyAprilPeriodsForYear } from './six-monthly-april';
import { generateYearlyPeriodsUpToYear } from './yearly';
import { generateFinancialOctoberPeriodsUpToYear } from './financial-october';
import { generateFinancialJulyPeriodsUpToYear } from './financial-july';
import { generateFinancialAprilPeriodsUpToYear } from './financial-april';

/**
 *
 * @param locale
 * @returns {{generateDailyPeriodsForYear: (function(*=): *), generateWeeklyPeriodsForYear: (function(*=): *), generateMonthlyPeriodsForYear: (function(*=): *), generateBiMonthlyPeriodsForYear: (function(*=): *), generateQuarterlyPeriodsForYear: (function(*=): *), generateSixMonthlyPeriodsForYear: (function(*=): *), generateSixMonthlyAprilPeriodsForYear: (function(*=): *), generateYearlyPeriodsUpToYear: (function(*=, *=): *), generateFinancialOctoberPeriodsUpToYear: (function(*=, *=): *), generateFinancialJulyPeriodsUpToYear: (function(*=, *=): *), generateFinancialAprilPeriodsUpToYear: (function(*=, *=): *)}}
 */
export function createPeriodGeneratorsForLocale(locale = 'en') { // eslint-disable-line import/prefer-default-export
    return {
        generateDailyPeriodsForYear:
            year => generateDailyPeriodsForYear(year, locale),
        generateWeeklyPeriodsForYear:
            year => generateWeeklyPeriodsForYear(year, locale),
        generateMonthlyPeriodsForYear:
            year => generateMonthlyPeriodsForYear(year, locale),
        generateBiMonthlyPeriodsForYear:
            year => generateBiMonthlyPeriodsForYear(year, locale),
        generateQuarterlyPeriodsForYear:
            year => generateQuarterlyPeriodsForYear(year, locale),
        generateSixMonthlyPeriodsForYear:
            year => generateSixMonthlyPeriodsForYear(year, locale),
        generateSixMonthlyAprilPeriodsForYear:
            year => generateSixMonthlyAprilPeriodsForYear(year, locale),
        generateYearlyPeriodsUpToYear:
            (year, numberOfYears) => generateYearlyPeriodsUpToYear(year, numberOfYears, locale),
        generateFinancialOctoberPeriodsUpToYear:
            (year, numberOfYears) => generateFinancialOctoberPeriodsUpToYear(year, numberOfYears, locale),
        generateFinancialJulyPeriodsUpToYear:
            (year, numberOfYears) => generateFinancialJulyPeriodsUpToYear(year, numberOfYears, locale),
        generateFinancialAprilPeriodsUpToYear:
            (year, numberOfYears) => generateFinancialAprilPeriodsUpToYear(year, numberOfYears, locale),
    };
}
