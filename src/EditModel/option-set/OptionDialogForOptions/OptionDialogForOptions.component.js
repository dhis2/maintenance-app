

import { Observable } from 'rxjs';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import { getInstance } from 'd2/lib/d2';

import AddOptionDialog from './AddOptionDialog.component';

import { createFieldConfigForModelTypes, isAttribute } from '../../formHelpers';
import { optionDialogStore } from '../stores';
import modelToEditStore from '../../modelToEditStore';
import {
    typeToFieldMap,
    getFieldUIComponent,
    getValidatorsFromModelValidation,
    createValidatorFromValidatorFunction,
} from '../../../forms/fields';

/*
 * Since this is custom for option sets, the validator is created here rather than in
 * forms/fields. 
 */
function createValidatorForUniqueNames(nameFieldConfig, modelToEdit, d2) {
    const optionNames = Array.from(modelToEdit.options.values())
        .map(option => option.name);

    const uniqueNameValidator = (name) => {
        if (optionNames.includes(name)) {
            return false;
        }
        return true;
    };
    uniqueNameValidator.message = d2.i18n.getTranslation('name_must_be_unique');

    nameFieldConfig.validators
        .push(createValidatorFromValidatorFunction(uniqueNameValidator));
}

const optionForm$ = Observable
    .combineLatest(
        Observable.fromPromise(createFieldConfigForModelTypes('option')),
        modelToEditStore,
    )
    .flatMap(async ([fieldConfigs, modelToEdit]) => {
        const d2 = await getInstance();
        return fieldConfigs
            .map((fieldConfig) => {
                // Adjust the code when dealing with a different
                if (fieldConfig.name === 'code' && typeToFieldMap.has(modelToEdit.valueType)) {
                    // Get the correct matching Ui component
                    fieldConfig.component = getFieldUIComponent(typeToFieldMap.get(modelToEdit.valueType));
                    // Copy the optionSet value type onto the code field
                    fieldConfig.type = typeToFieldMap.get(modelToEdit.valueType);
                    // Generate the validator and pre-translate their messages
                    fieldConfig.validators = getValidatorsFromModelValidation(fieldConfig, d2.models.option)
                        .map((validator) => {
                            validator.message = d2.i18n.getTranslation(validator.message);
                            return validator;
                        });
                }
                if (fieldConfig.name === 'name') {
                    createValidatorForUniqueNames(fieldConfig, modelToEdit, d2);
                }
                // For the code field we replace the fieldConfig with a config that matches the type of the optionSet
                return fieldConfig;
            });
    });

const optionFormData$ = Observable.combineLatest(
    optionForm$,
    optionDialogStore,
    (fieldConfigs, optionDialogState) => ({
        fieldConfigs,
        model: optionDialogState.model,
        isAdd: !optionDialogState.model.id,
        isDialogOpen: optionDialogState.isDialogOpen,
    }))
    .flatMap(async ({ fieldConfigs, model, isAdd, ...other }) => {
        const d2 = await getInstance();

        return Promise.resolve({
            fieldConfigs: fieldConfigs.map((fieldConfig) => {
                if (isAttribute(model, fieldConfig)) {
                    fieldConfig.value = model.attributes[fieldConfig.name];
                } else {
                    fieldConfig.value = model[fieldConfig.name];
                }

                if (fieldConfig.name === 'code' && !isAdd) {
                    fieldConfig.props.disabled = true;
                } else {
                    fieldConfig.props.disabled = false;
                }

                return fieldConfig;
            }),
            model,
            isAdd,
            title: d2.i18n.getTranslation(isAdd ? 'option_add' : 'option_edit'),
            ...other,
        });
    })
    .filter(({ fieldConfigs }) => fieldConfigs.length);

export default withStateFrom(optionFormData$, AddOptionDialog);
