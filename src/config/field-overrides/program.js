import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

/**
 * Program-model are shared for both event-programs and
 * tracker-programs notifications. We use a customFieldOrder name to differentiate
 * between these two, as they have different behavior and overrides.
 */

const sharedOverrides = new Map([
    [
        'categoryCombo',
        {
            fieldOptions: {
                queryParamFilter: [
                    'dataDimensionType:eq:ATTRIBUTE',
                    'name:eq:default',
                ],
            },
        },
    ],
    [
        'expiryPeriodType',
        {
            component: PeriodTypeDropDown,
        },
    ],
]);

export const eventProgram = new Map([...sharedOverrides]);

//Enrollment is used as customFieldOrderName for enrollment-stepper
export const enrollment = new Map([
    ...sharedOverrides,
]);

export const trackerProgram = new Map([
    ...sharedOverrides,

    [
        'trackedEntityType',
        {
            required: true,
        },
    ],
]);

export default eventProgram;
