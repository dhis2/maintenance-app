const fieldOrderByName = new Map([
    ['dataElement', [
        'name', 'shortName', 'code', 'description', 'formName', 'domainType', 'valueType', 'aggregationType',
        'zeroIsSignificant', 'url', 'categoryCombo', 'optionSet', 'commentOptionSet', 'legendSet', 'aggregationLevels']],
    ['dataElementGroupSet', ['name', 'shortName', 'code', 'description', 'compulsory', 'dataDimension']],
    ['category', ['name', 'shortName', 'code', 'dataDimension', 'dataDimensionType', 'categoryOptions']],
    ['categoryCombo', ['name', 'code', 'dimensionType', 'skipTotal', 'categories']],
    ['categoryOptionGroupSet', ['name', 'description', 'dataDimension', 'categoryOptionGroups']],
    ['indicator', ['name', 'shortName', 'code', 'description', 'annualized', 'decimals', 'indicatorType', 'legendSet', 'url']],
    ['indicatorGroup', ['name', 'indicators']],
    ['indicatorType', ['name', 'factor', 'number']],
    ['indicatorGroupSet', ['name', 'description', 'compulsory', 'indicatorGroups']],
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
