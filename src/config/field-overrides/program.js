import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
import DropDownAsyncGetter from '../../forms/form-fields/drop-down-async-getter';

async function getRelationshipTypes(model, d2) {
    if (!model.relationshipType) {
        return [];
    }
    const relationship = await d2.models.relationshipTypes.get(
        model.relationshipType.id,
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

export default new Map([
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
    // Translate realtionShipFromA to a drop-down consisting of the relationships
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
