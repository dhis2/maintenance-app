export function getSideBarConfig() {
        return {
            all: {
                items: [],
            },

            categorySection: {
                items: [
                    'categoryOption',
                    'category',
                    'categoryCombo',
                    'categoryOptionCombo',
                    'categoryOptionGroup',
                    'categoryOptionGroupSet',
                ]
            },

            dataElementSection: {
                items: [
                    'dataElement',
                    'dataElementGroup',
                    'dataElementGroupSet',
                ],
            },
            dataSetSection: {
                items: [
                    'dataSet',
                ],
            },
            indicatorSection: {
                items: [
                    'indicator',
                    'indicatorType',
                    'indicatorGroup',
                    'indicatorGroupSet',
                ],
            },

            organisationUnitSection: {
                items: [
                    'organisationUnit',
                    'organisationUnitGroup',
                    'organisationUnitGroupSet',
                    'organisationUnitLevel',
                ],
            },

            programSection: {
                items: [
                    'trackedEntityAttribute',
                    'trackedEntityAttributeGroup',
                    'relationshipType',
                    'trackedEntity',
                ],
            },

            validationSection: {
                items: [
                    'validationRule',
                    'validationRuleGroup',
                    'validationNotificationTemplate',
                ]
            },

            otherSection: {
                items: [
                    'constant',
                    'attribute',
                    'optionSet',
                    'legendSet',
                    'predictor',
                    'pushAnalysis',
                    'externalMapLayer',
                ],
            },
        };
}

export function getSectionForType(modelType) {
    const config = getSideBarConfig();

    return Object
        .keys(config)
        .find(section => {
            return config[section] &&
                config[section].items &&
                config[section].items.indexOf(modelType) >= 0;
        });
}

export default {
    getSideBarConfig,
};
