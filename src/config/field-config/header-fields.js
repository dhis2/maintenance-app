let headerFieldsMap = new Map([
    ['dataElementGroupSet', ['name', 'code']],
    ['categoryOptionCombo', ['name', 'code']],
    ['category', ['name', 'code']],
    ['categoryCombo', ['name', 'code']]
]);

export default {
    /**
     * @method
     *
     * @params {String} schemaName The name of the schema for which to get the field order
     * @returns {Array} An arraylist of field names
     * This can be used to set the header fields on the `FormFieldsManager`
     */
    for(schemaName) {
        if (schemaName && headerFieldsMap.has(schemaName)) {
            return headerFieldsMap.get(schemaName);
        }
        return ['name', 'shortName'];
    }
};
