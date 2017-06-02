import dataElement from './dataElement';
import indicator from './indicator';
import dataSet from './dataSet';
import organisationUnit from './organisationUnit';
import organisationUnitGroup from './organisationUnitGroup';
import categoryCombo from './categoryCombo';
import categoryOption from './categoryOption';
import legendSet from './legendSet';
import trackedEntityAttribute from './trackedEntityAttribute';
import predictor from './predictor';
import pushAnalysis from './pushAnalysis';
import externalMapLayer from './externalMapLayer';
import validationRule from './validationRule';
import validationNotificationTemplate from './validationNotificationTemplate';

const overridesByType = {
    dataElement,
    indicator,
    dataSet,
    organisationUnit,
    organisationUnitGroup,
    categoryCombo,
    categoryOption,
    legendSet,
    trackedEntityAttribute,
    predictor,
    pushAnalysis,
    externalMapLayer,
    validationNotificationTemplate,
    validationRule,
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
