import dataElement from './dataElement';
import indicator from './indicator';
import dataSet from './dataSet';
import organisationUnit from './organisationUnit';
import organisationUnitGroup from './organisationUnitGroup';
import categoryOption from './categoryOption';
import validationRule from './validationRule';
import legendSet from './legendSet';

const overridesByType = {
    dataElement,
    indicator,
    dataSet,
    organisationUnit,
    organisationUnitGroup,
    categoryOption,
    validationRule,
    legendSet,
};

export default {
    /**
     * @method
     *
     * @params {String} schemaName The name of the schema for which to get the overrides
     * @returns {Map} A map with the name and configs of the field overrides.
     * This can be used to easily add overrides for a type to your `FormFieldsManager`
     *
     * @example
     * ```
     * import fieldOverrides from 'field-overrides';
     *
     * let dataElementOverrides = fieldOverrides.for('dataElement');
     * ```
     */
    for(schemaName) {
        if (schemaName && overridesByType[schemaName]) {
            return overridesByType[schemaName];
        }
        return new Map();
    },
};
