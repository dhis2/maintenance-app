const fieldOrderByName = new Map([
    ['dataElement', [
        'name', 'shortName', 'code', 'description', 'formName', 'domainType', 'valueType', 'aggregationType',
        'zeroIsSignificant', 'url', 'categoryCombo', 'optionSet', 'commentOptionSet', 'legendSet', 'aggregationLevels']],
    ['dataElementGroup', ['name', 'shortName', 'code', 'dataElements']],
    ['dataElementGroupSet', ['name', 'shortName', 'code', 'description', 'compulsory', 'dataDimension', 'dataElementGroups']],
    ['category', ['name', 'shortName', 'code', 'dataDimensionType', 'dataDimension', 'categoryOptions']],
    ['categoryOption', ['name', 'shortName', 'code', 'startDate', 'endDate']],
    ['categoryCombo', ['name', 'shortName', 'code', 'dataDimensionType', 'skipTotal', 'categories']],
    ['categoryOptionGroup', ['name', 'shortName', 'code', 'dataDimensionType', 'categoryOptions']],
    ['categoryOptionGroupSet', ['name', 'description', 'dataDimension', 'dataDimensionType', 'categoryOptionGroups']],
    ['indicator', ['name', 'shortName', 'code', 'description', 'annualized', 'decimals', 'indicatorType', 'legendSet', 'url']],
    ['indicatorGroup', ['name', 'indicators']],
    ['indicatorType', ['name', 'factor', 'number']],
    ['indicatorGroupSet', ['name', 'description', 'compulsory', 'indicatorGroups']],
    ['dataSet', [
        'name',
        'shortName',
        'code',
        'description',
        'expiryDays',
        'openFuturePeriods',
        'timelyDays',
        'periodType',
        'categoryCombo',
        'notificationRecipients',
        'notifyCompletingUser',
        'workflow',
        'mobile',
        'fieldCombinationRequired',
        'validCompleteOnly',
        'noValueRequiresComment',
        'legendSet',
        'skipOffline',
        'dataElementDecoration',
        'renderAsTabs',
        'renderHorizontally',
        'dataElements',
        'indicators',
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
