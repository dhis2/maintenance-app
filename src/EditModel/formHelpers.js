import { getInstance } from 'd2/lib/d2';
import FormFieldsForModel from '../forms/FormFieldsForModel';
import FormFieldsManager from '../forms/FormFieldsManager';
import fieldOrderNames from '../config/field-config/field-order';
import fieldOverrides from '../config/field-overrides/index';
import { createFieldConfig, typeToFieldMap } from '../forms/fields';
import mapPropsStream from 'recompose/mapPropsStream';
import { identity } from 'lodash/fp';
import { Observable } from 'rxjs';
import React from 'react';
import compose from 'recompose/compose';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { noop, } from 'lodash/fp';

function getLabelText(labelText, fieldConfig = {}) {
    // Add required indicator when the field is required
    if (fieldConfig.props && fieldConfig.props.isRequired) {
        return `${labelText} (*)`;
    }
    return labelText;
}

export async function createFieldConfigForModelTypes(modelType, forcedFieldOrderNames, includeAttributes = true) {
    const d2 = await getInstance();

    const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
    formFieldsManager.setFieldOrder(forcedFieldOrderNames || fieldOrderNames.for(modelType));

    for (const [fieldName, overrideConfig] of fieldOverrides.for(modelType)) {
        formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
    }

    return formFieldsManager.getFormFieldsForModel({ modelDefinition: d2.models[modelType] })
        .map(fieldConfig => {
            // Translate the sync validator messages if there are any validators
            if (fieldConfig.validators) {
                fieldConfig.validators = fieldConfig.validators
                    .map(validator => ({
                        ...validator,
                        message: d2.i18n.getTranslation(validator.message),
                    }));
            }

            // Get the field's label with required indicator if the field is required
            fieldConfig.props.labelText = getLabelText(d2.i18n.getTranslation(fieldConfig.props.labelText), fieldConfig);

            return fieldConfig;
        }).concat(includeAttributes ? createAttributeFieldConfigs(d2, modelType) : []);
}

function createUniqueValidator(fieldConfig, modelDefinition, uid) {
    return function checkAgainstServer(value) {
        // Don't validate against the server when we have no value
        if (!value || !value.trim()) {
            return Promise.resolve(true);
        }

        let modelDefinitionWithFilter = modelDefinition
            .filter().on(fieldConfig.fieldOptions.referenceProperty).equals(value);

        if (uid) {
            modelDefinitionWithFilter = modelDefinitionWithFilter.filter().on('id').notEqual(uid);
        }

        return modelDefinitionWithFilter
            .list()
            .then(collection => {
                if (collection.size !== 0) {
                    return getInstance()
                        .then(d2 => d2.i18n.getTranslation('value_not_unique'))
                        .then(message => Promise.reject(message));
                }
                return Promise.resolve(true);
            });
    };
}

export function addUniqueValidatorWhenUnique(fieldConfig, modelToEdit) {
    if (fieldConfig.unique) {
        fieldConfig.asyncValidators = [createUniqueValidator(fieldConfig, modelToEdit.modelDefinition, modelToEdit.id)];
    }

    return fieldConfig;
}

function createAttributeFieldConfigs(d2, schemaName) {
    const modelDefinition = d2.models[schemaName];

    return Object
        .keys(modelDefinition.attributeProperties)
        .map(attributeName => {
            const attribute = modelDefinition.attributeProperties[attributeName];

            return createFieldConfig({
                name: attribute.name,
                valueType: attribute.valueType,
                type: typeToFieldMap.get(attribute.optionSet ? 'CONSTANT' : attribute.valueType),
                required: Boolean(attribute.mandatory),
                fieldOptions: {
                    labelText: attribute.name,
                    options: attribute.optionSet ? attribute.optionSet.options.map(option => {
                        return {
                            name: option.displayName || option.name,
                            value: option.code,
                        };
                    }) : [],
                },
            }, modelDefinition, d2.models);
        });
}

export function isAttribute(model, fieldConfig) {
    return model.attributes && new Set(Object.keys(model.attributes)).has(fieldConfig.name);
}


const addModelToFieldConfigProps = model => fieldConfig => ({
    ...fieldConfig,
    props: { ...fieldConfig.props, model, }
});

function addValuesToFieldConfigs(fieldConfigs, model) {
    return fieldConfigs
        .map(fieldConfig => {
            if (isAttribute(model, fieldConfig)) {
                return ({
                    ...fieldConfig,
                    value: model.attributes[fieldConfig.name],
                });
            }

            return ({
                ...fieldConfig,
                value: model[fieldConfig.name]
            })
        })
        .map(addModelToFieldConfigProps(model));
}

export function createFieldConfigsFor(schema, fieldNames, filterFieldConfigs = identity, includeAttributes) {
    return mapPropsStream(props$ => props$
        .filter(({ model }) => model)
        .combineLatest(
            Observable.fromPromise(createFieldConfigForModelTypes(schema, fieldNames, includeAttributes)),
            (props, fieldConfigs) => ({
                ...props,
                fieldConfigs: filterFieldConfigs(addValuesToFieldConfigs(fieldConfigs, props.model)),
            })
        )
    );
}

// TODO: Refactor includeAttributes magic flag to separate method `createFormWithAttributesFor`
export function createFormFor(source$, schema, properties, includeAttributes) {
    const enhance = compose(
        mapPropsStream(props$ => props$
            .combineLatest(source$, (props, model) => ({ ...props, model}))
        ),
        createFieldConfigsFor(schema, properties, undefined, includeAttributes),
    );

    function CreatedFormBuilderForm({ fieldConfigs, editFieldChanged, detailsFormStatusChange = noop }) {
        return (
            <FormBuilder
                fields={fieldConfigs}
                onUpdateField={editFieldChanged}
                onUpdateFormStatus={detailsFormStatusChange}
            />
        );
    }

    return enhance(CreatedFormBuilderForm);
}

export function createFormActionButtonsFor() {

}
