const fieldOrderByName = new Map([
    ['dataElement', [
        'name',
        'shortName',
        'code',
        'style',
        'description',
        'fieldMask',
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
        'code',
        'description',
        'compulsory',
        'indicatorGroups',
    ]],
    // TODO: Split into field group
    ['dataSet', [
        'name',
        'shortName',
        'code',
        'style',
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
        'compulsoryFieldsCompleteOnly',
        'dataSetElements',
        'indicators',
        'organisationUnits',
    ]],
    ['dataSetNotificationTemplate', [
        // Step 1
        'name', 'code', 'dataSets', 'messageTemplate',
        // Step 2
        'dataSetNotificationTrigger', 'relativeScheduledDays', 'sendStrategy',
        // Step 3
        'notificationRecipient', 'recipientUserGroup', 'deliveryChannels',
    ]],
    ['organisationUnit', [
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
        'programs',

    ]],
    ['organisationUnitGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'color',
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
        'shortName',
        'code',
        'description',
        'valueType',
        'optionSet',
        'sortOrder',
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
    ['option', [
        'name',
        'code',
        'style',
    ]],
    ['legendSet', [
        'name',
        'code',
        'legends',
    ]],
    ['eventProgram', [
        'name',
        'style',
        'shortName',
        'code',
        'description',
        'version',
        'categoryCombo',
        'workflow',
        'completeEventsExpiryDays',
        'expiryPeriodType',
        'expiryDays',
    ]],
    ['eventProgramStage', [
        'blockEntryForm',
        'featureType',
        'validationStrategy',
        'preGenerateUID',
        'executionDateLabel',
    ]],
    ['trackerProgram', [
        'name',
        'shortName',
        'code',
        'style',
        'description',
        'version',
        'trackedEntityType',
        'categoryCombo',
        'workflow',
        'displayFrontPageList',
        'useFirstStageDuringRegistration',
        'accessLevel',
        'completeEventsExpiryDays',
        'expiryPeriodType',
        'expiryDays',
        'programAttributes',
        'minAttributesRequiredToSearch',
        'maxTeiCountToReturn',
    ]],
    // Tracker-program
    ['enrollment', [
        'selectEnrollmentDatesInFuture',
        'selectIncidentDatesInFuture',
        'onlyEnrollOnce',
        'displayIncidentDate',
        'incidentDateLabel',
        'enrollmentDateLabel',
        'ignoreOverdueEvents',
        'featureType',
        'relatedProgram',
    ]],
    ['programStage', [
        'name',
        'style',
        'description',
        'minDaysFromStart',
        'repeatable',
        'periodType',
        'displayGenerateEventBox',
        'standardInterval',
        'autoGenerateEvent',
        'openAfterEnrollment',
        'reportDateToUse',
        'blockEntryForm',
        'remindCompleted',
        'allowGenerateNextVisit',
        'generatedByEnrollmentDate',
        'hideDueDate',
        'featureType',
        'preGenerateUID',
        'executionDateLabel',
        'dueDateLabel',
    ]],
    ['trackedEntityAttribute', [
        'name',
        'shortName',
        'formName',
        'code',
        'description',
        'optionSet',
        'valueType',
        'aggregationType',
        'unique',
        'orgunitScope',
        'generated',
        'pattern',
        'inherit',
        'confidential',
        'displayInListNoProgram',
        'skipSynchronization',
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
        'description',
        'fromConstraint',
        'toConstraint',
    ]],
    ['trackedEntityType', [
        'name',
        'style',
        'description',
        'allowAuditLog',
        'minAttributesRequiredToSearch',
        'maxTeiCountToReturn',
        'featureType',
        'trackedEntityTypeAttributes',
    ]],
    ['programIndicator', [
        'program',
        'name',
        'shortName',
        'code',
        'description',
        'decimals',
        'aggregationType',
        'analyticsType',
        'analyticsPeriodBoundaries',
        'displayInForm',
        'legendSets',
        'aggregateExportCategoryOptionCombo',
        'aggregateExportAttributeOptionCombo',
        'expression',
        'filter',
    ]],
    ['programIndicatorGroup', [
        'name',
        'code',
        'programIndicators',
    ]],
    ['validationRule', [
        'name',
        'shortName',
        'code',
        'description',
        'instruction',
        'importance',
        'ruleType',
        'importance',
        'ruleType',
        'periodType',
        'leftSide',
        'operator',
        'rightSide',
        'organisationUnitLevels',
        'skipFormValidation',
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
    ['predictorGroup', [
        'name',
        'code',
        'description',
        'predictors',
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
        'sendStrategy',
        'notifyUsersInHierarchyOnly',
        'messageTemplate',
    ]],
    ['programRule', [
        // Step 1
        'program', 'programStage', 'name', 'description', 'priority',
        // Step 2
        'condition',
        // Step 3
        'programRuleActions',
    ]],
    ['programRuleVariable', [
        'program',
        'name',
        'useCodeForOptionSet',
        'programRuleVariableSourceType',
        'programStage',
        'dataElement',
        'trackedEntityAttribute',
    ]],
    ['dataApprovalLevel', [
        'name',
        'orgUnitLevel',
        'categoryOptionGroupSet',
    ]],
    ['dataApprovalWorkflow', [
        'name',
        'periodType',
        'dataApprovalLevels',
    ]],
    ['optionGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'optionSet',
        'options',
    ]],
    ['optionGroupSet', [
        'name',
        'code',
        'description',
        'optionSet',
        'dataDimension',
        'optionGroups',
    ]],
    ['locale', [
        'name',
        'locale',
    ]],
    ['sqlView', [
        'name',
        'description',
        'cacheStrategy',
        'type',
        'sqlQuery',
    ]],
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
     * import fieldOrder from 'field-order';
     *
     * let dataElementFields = fieldOrder.for('dataElement');
     * ```
     */
    for(schemaName) {
        if (schemaName && fieldOrderByName.has(schemaName)) {
            return fieldOrderByName.get(schemaName);
        }
        return ['name', 'shortName', 'code'];
    },
};
