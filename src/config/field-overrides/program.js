import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
import DropDownAsyncGetter from '../../forms/form-fields/drop-down-async-getter';

async function getRelationshipTypes(model, d2) {
    if (!model.relationshipType) {
        return [];
    }
    const relationship = await d2.models.relationshipTypes.get(
        model.relationshipType.id
    );
    const relationshipOptions = [
        {
            text: relationship.aIsToB,
            value: true,
        },
        {
            text: relationship.bIsToA,
            value: false,
        },
    ];

    return relationshipOptions;
}

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
    // Translate relationShipFromA to a drop-down consisting of the relationships
    [
        'relationshipFromA',
        {
            component: DropDownAsyncGetter,
            persisted: true,
            fieldOptions: {
                getter: getRelationshipTypes,
                useValueDotId: false,
            },
        },
    ],
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
