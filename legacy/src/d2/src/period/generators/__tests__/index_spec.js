import { createPeriodGeneratorsForLocale } from '..';
import * as daily from '../daily';
import * as weekly from '../weekly';
import * as monthly from '../monthly';
import * as bimonthly from '../bi-monthly';
import * as quarterly from '../quarterly';
import * as sixmonthly from '../six-monthly';
import * as sixmonthlyapril from '../six-monthly-april';
import * as yearly from '../yearly';
import * as financialoctober from '../financial-october';
import * as financialjuly from '../financial-july';
import * as financialapril from '../financial-april';

describe('generators', () => {
    describe('createPeriodGeneratorsForLocale()', () => {
        describe('daily', () => {
            beforeEach(() => {
                jest.spyOn(daily, 'generateDailyPeriodsForYear');
            });

            afterEach(() => {
                daily.generateDailyPeriodsForYear.mockRestore();
            });

            it('should have the daily period generator', () => {
                expect(typeof createPeriodGeneratorsForLocale('nl').generateDailyPeriodsForYear).toBe('function');
            });

            it('should call the the daily generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateDailyPeriodsForYear(2017);

                expect(daily.generateDailyPeriodsForYear).toBeCalledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateDailyPeriodsForYear(2017);

                expect(generators.generateDailyPeriodsForYear(2017))
                    .toEqual(daily.generateDailyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('weekly', () => {
            beforeEach(() => {
                jest.spyOn(weekly, 'generateWeeklyPeriodsForYear');
            });

            afterEach(() => {
                weekly.generateWeeklyPeriodsForYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(typeof createPeriodGeneratorsForLocale('nl').generateWeeklyPeriodsForYear).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateWeeklyPeriodsForYear(2017);

                expect(weekly.generateWeeklyPeriodsForYear).toBeCalledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateWeeklyPeriodsForYear(2017);

                expect(generators.generateWeeklyPeriodsForYear(2017))
                    .toEqual(weekly.generateWeeklyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('monthly', () => {
            beforeEach(() => {
                jest.spyOn(monthly, 'generateMonthlyPeriodsForYear');
            });

            afterEach(() => {
                monthly.generateMonthlyPeriodsForYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(typeof createPeriodGeneratorsForLocale('nl').generateMonthlyPeriodsForYear).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateMonthlyPeriodsForYear(2017);

                expect(monthly.generateMonthlyPeriodsForYear).toBeCalledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateMonthlyPeriodsForYear(2017);

                expect(generators.generateMonthlyPeriodsForYear(2017))
                    .toEqual(monthly.generateMonthlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('bi-monthly', () => {
            beforeEach(() => {
                jest.spyOn(bimonthly, 'generateBiMonthlyPeriodsForYear');
            });

            afterEach(() => {
                bimonthly.generateBiMonthlyPeriodsForYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(
                    typeof createPeriodGeneratorsForLocale('nl').generateBiMonthlyPeriodsForYear,
                ).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateBiMonthlyPeriodsForYear(2017);

                expect(bimonthly.generateBiMonthlyPeriodsForYear).toBeCalledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateBiMonthlyPeriodsForYear(2017);

                expect(generators.generateBiMonthlyPeriodsForYear(2017))
                    .toEqual(bimonthly.generateBiMonthlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('quarterly', () => {
            beforeEach(() => {
                jest.spyOn(quarterly, 'generateQuarterlyPeriodsForYear');
            });

            afterEach(() => {
                quarterly.generateQuarterlyPeriodsForYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(
                    typeof createPeriodGeneratorsForLocale('nl').generateQuarterlyPeriodsForYear,
                ).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateQuarterlyPeriodsForYear(2017);

                expect(quarterly.generateQuarterlyPeriodsForYear).toBeCalledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateQuarterlyPeriodsForYear(2017);

                expect(generators.generateQuarterlyPeriodsForYear(2017))
                    .toEqual(quarterly.generateQuarterlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('six-monthly', () => {
            beforeEach(() => {
                jest.spyOn(sixmonthly, 'generateSixMonthlyPeriodsForYear');
            });

            afterEach(() => {
                sixmonthly.generateSixMonthlyPeriodsForYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(
                    typeof createPeriodGeneratorsForLocale('nl').generateSixMonthlyPeriodsForYear,
                ).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyPeriodsForYear(2017);

                expect(sixmonthly.generateSixMonthlyPeriodsForYear).toBeCalledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyPeriodsForYear(2017);

                expect(generators.generateSixMonthlyPeriodsForYear(2017))
                    .toEqual(sixmonthly.generateSixMonthlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('six-monthly-april', () => {
            beforeEach(() => {
                jest.spyOn(sixmonthlyapril, 'generateSixMonthlyAprilPeriodsForYear');
            });

            afterEach(() => {
                sixmonthlyapril.generateSixMonthlyAprilPeriodsForYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(
                    typeof createPeriodGeneratorsForLocale('nl').generateSixMonthlyPeriodsForYear,
                ).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyAprilPeriodsForYear(2017);

                expect(sixmonthlyapril.generateSixMonthlyAprilPeriodsForYear).toBeCalledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyAprilPeriodsForYear(2017);

                expect(generators.generateSixMonthlyAprilPeriodsForYear(2017))
                    .toEqual(sixmonthlyapril.generateSixMonthlyAprilPeriodsForYear(2017, 'nl'));
            });
        });

        describe('yearly', () => {
            beforeEach(() => {
                jest.spyOn(yearly, 'generateYearlyPeriodsUpToYear');
            });

            afterEach(() => {
                yearly.generateYearlyPeriodsUpToYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(typeof createPeriodGeneratorsForLocale('nl').generateYearlyPeriodsUpToYear).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(yearly.generateYearlyPeriodsUpToYear).toBeCalledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(generators.generateYearlyPeriodsUpToYear(2017, 10))
                    .toEqual(yearly.generateYearlyPeriodsUpToYear(2017, 10, 'nl'));
            });
        });

        describe('yearly', () => {
            beforeEach(() => {
                jest.spyOn(yearly, 'generateYearlyPeriodsUpToYear');
            });

            afterEach(() => {
                yearly.generateYearlyPeriodsUpToYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(typeof createPeriodGeneratorsForLocale('nl').generateYearlyPeriodsUpToYear).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(yearly.generateYearlyPeriodsUpToYear).toBeCalledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(generators.generateYearlyPeriodsUpToYear(2017, 10))
                    .toEqual(yearly.generateYearlyPeriodsUpToYear(2017, 10, 'nl'));
            });
        });

        describe('financial-october', () => {
            beforeEach(() => {
                jest.spyOn(financialoctober, 'generateFinancialOctoberPeriodsUpToYear');
            });

            afterEach(() => {
                financialoctober.generateFinancialOctoberPeriodsUpToYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(
                    typeof createPeriodGeneratorsForLocale('nl').generateFinancialOctoberPeriodsUpToYear,
                ).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialOctoberPeriodsUpToYear(2017);

                expect(financialoctober.generateFinancialOctoberPeriodsUpToYear).toBeCalledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialOctoberPeriodsUpToYear(2017);

                expect(generators.generateFinancialOctoberPeriodsUpToYear(2017, 5))
                    .toEqual(financialoctober.generateFinancialOctoberPeriodsUpToYear(2017, 5, 'nl'));
            });
        });

        describe('financial-july', () => {
            beforeEach(() => {
                jest.spyOn(financialjuly, 'generateFinancialJulyPeriodsUpToYear');
            });

            afterEach(() => {
                financialjuly.generateFinancialJulyPeriodsUpToYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(
                    typeof createPeriodGeneratorsForLocale('nl').generateFinancialJulyPeriodsUpToYear,
                ).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialJulyPeriodsUpToYear(2017);

                expect(financialjuly.generateFinancialJulyPeriodsUpToYear).toBeCalledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialJulyPeriodsUpToYear(2017);

                expect(generators.generateFinancialJulyPeriodsUpToYear(2017, 5))
                    .toEqual(financialjuly.generateFinancialJulyPeriodsUpToYear(2017, 5, 'nl'));
            });
        });

        describe('financial-april', () => {
            beforeEach(() => {
                jest.spyOn(financialapril, 'generateFinancialAprilPeriodsUpToYear');
            });

            afterEach(() => {
                financialapril.generateFinancialAprilPeriodsUpToYear.mockRestore();
            });

            it('should have the weekly period generator', () => {
                expect(
                    typeof createPeriodGeneratorsForLocale('nl').generateFinancialAprilPeriodsUpToYear,
                ).toBe('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialAprilPeriodsUpToYear(2017);

                expect(financialapril.generateFinancialAprilPeriodsUpToYear).toBeCalledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialAprilPeriodsUpToYear(2017);

                expect(generators.generateFinancialAprilPeriodsUpToYear(2017, 5))
                    .toEqual(financialapril.generateFinancialAprilPeriodsUpToYear(2017, 5, 'nl'));
            });
        });
    });

    describe('default values', () => {
        beforeEach(() => {
            jest.spyOn(daily, 'generateDailyPeriodsForYear');
        });

        it('should use the default locale when no locale is passed', () => {
            const generators = createPeriodGeneratorsForLocale();

            generators.generateDailyPeriodsForYear(2017);

            expect(daily.generateDailyPeriodsForYear).toBeCalledWith(2017, 'en');
        });
    });
});
