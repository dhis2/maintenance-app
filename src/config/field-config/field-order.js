const fieldOrderByName = new Map([
    ['dataElement', [
        'name',
        'shortName',
        'code',
        'description',
        'formName',
        'domainType',
        'valueType',
        'aggregationType',
        'zeroIsSignificant',
        'url',
        'categoryCombo',
        'optionSet',
        'commentOptionSet',
        'legendSets',
        'aggregationLevels',
    ]],
    ['dataElementGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'dataElements',
    ]],
    ['dataElementGroupSet', [
        'name',
        'shortName',
        'code',
        'description',
        'compulsory',
        'dataDimension',
        'dataElementGroups',
    ]],
    ['category', [
        'name',
        'shortName',
        'code',
        'description',
        'dataDimensionType',
        'dataDimension',
        'categoryOptions',
    ]],
    ['categoryOption', [
        'name',
        'shortName',
        'code',
        'description',
        'startDate',
        'endDate',
        'organisationUnits',
    ]],
    ['categoryCombo', [
        'name',
        'shortName',
        'code',
        'dataDimensionType',
        'skipTotal',
        'categories',
    ]],
    ['categoryOptionGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'dataDimensionType',
        'categoryOptions',
    ]],
    ['categoryOptionGroupSet', [
        'name',
        'description',
        'dataDimension',
        'dataDimensionType',
        'categoryOptionGroups',
    ]],
    ['indicator', [
        'name',
        'shortName',
        'code',
        'description',
        'annualized',
        'decimals',
        'indicatorType',
        'legendSets',
        'url',
        'aggregateExportCategoryOptionCombo',
        'aggregateExportAttributeOptionCombo',
    ]],
    ['indicatorGroup', [
        'name',
        'indicators',
    ]],
    ['indicatorType', [
        'name',
        'factor',
    ]],
    ['indicatorGroupSet', [
        'name',
        'description',
        'compulsory',
        'indicatorGroups',
    ]],
    ['dataSet', [
        'name',
        'shortName',
        'code',
        'description',
        'expiryDays',
        'openFuturePeriods',
        'timelyDays',
        'periodType',
        'dataInputPeriods',
        'categoryCombo',
        'notificationRecipients',
        'notifyCompletingUser',
        'workflow',
        'mobile',
        'fieldCombinationRequired',
        'validCompleteOnly',
        'noValueRequiresComment',
        'legendSets',
        'skipOffline',
        'dataElementDecoration',
        'renderAsTabs',
        'renderHorizontally',
        'dataSetElements',
        'indicators',
        'organisationUnits',
    ]],
    ['organisationUnit', [
        'parent',
        'name',
        'shortName',
        'code',
        'description',
        'openingDate',
        'closedDate',
        'comment',
        'url',
        'contactPerson',
        'address',
        'email',
        'phoneNumber',
        'coordinates',
        'dataSets',
    ]],
    ['organisationUnitGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'symbol',
        'organisationUnits',
    ]],
    ['organisationUnitGroupSet', [
        'name',
        'shortName',
        'code',
        'description',
        'compulsory',
        'dataDimension',
        'includeSubhierarchyInAnalytics',
        'organisationUnitGroups',
    ]],
    ['organisationUnitLevel', [
        'name',
        'offlineLevels',
    ]],
    ['constant', [
        'name',
        'shortName',
        'code',
        'description',
        'value',
    ]],
    ['attribute', [
        'name',
        'code',
        'valueType',
        'optionSet',
        'mandatory',
        'unique',
        'dataElementAttribute', // TODO: This currently serves as the override for all <type>Attribute fields
    ]],
    ['optionSet', [
        'name',
        'code',
        'description',
        'valueType',
    ]],
    ['legendSet', [
        'name',
        'code',
        'legends',
    ]],
    ['trackedEntityAttribute', [
        'name',
        'shortName',
        'code',
        'description',
        'optionSet',
        'valueType',
        'aggregationType',
        'unique',
        'inherit',
        'confidential',
        'displayInListNoProgram',
        'legendSets',
    ]],
    ['trackedEntityAttributeGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'trackedEntityAttributes',
    ]],
    ['relationshipType', [
        'name',
        'code',
        'aIsToB',
        'bIsToA',
    ]],
    ['trackedEntity', [
        'name',
        'description',
    ]],
    ['validationRule', [
        'name',
        'shortName',
        'code',
        'description',
        'importance',
        'ruleType',
        'importance',
        'ruleType',
        'periodType',
        'operator',
        'leftSide',
        'rightSide',
    ]],
    ['validationRuleGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'validationRules',
    ]],
    ['predictor', [
        'name',
        'shortName',
        'code',
        'description',
        'output',
        'periodType',
        'organisationUnitLevels',
        'generator',
        'sampleSkipTest',
        'sequentialSampleCount',
        'annualSampleCount',
        'sequentialSkipCount',
    ]],
    ['pushAnalysis', [
        'name',
        'code',
        'title',
        'message',
        'dashboard',
        'recipientUserGroups',
        'schedulingFrequency',
        'enabled',
    ]],
    ['externalMapLayer', [
        'name',
        'code',
        'mapService',
        'imageFormat',
        'url',
        'attribution',
        'mapLayerPosition',
        'legendSet',
        'legendSetUrl',
    ]],
    ['validationNotificationTemplate', [
        'name',
        'code',
        'validationRules',
        'recipientUserGroups',
        'notifyUsersInHierarchyOnly',
        'messageTemplate',
    ]]
]);

export default {
    /**
     * @method
     *
     * @params {String} schemaName The name of the schema for which to get the field order
     * @returns {Array} An arraylist of field names
     * This can be used to set field order on the `FormFieldsManager`
     *
     * @example
     * ```
     * import fieldOverrides from 'field-overrides';
     *
     * let dataElementOverrides = fieldOverrides.for('dataElement');
     * ```
     */
    for(schemaName) {
        if (schemaName && fieldOrderByName.has(schemaName)) {
            return fieldOrderByName.get(schemaName);
        }
        return ['name', 'shortName', 'code'];
    },
};
