import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField/TextField';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import { Observable } from 'rxjs';
import LocaleSelector from '../i18n/LocaleSelector.component';
import { getLocales, getTranslationsForModel, saveTranslations } from './translationForm.actions';
import withStateFrom from '../component-helpers/withStateFrom';
import Store from '../store/Store';
import CircularProgress from '../circular-progress/CircularProgress';

function getTranslationFormData(model) {
    const translationStore = Store.create();

    getTranslationsForModel(model)
        .subscribe((translations) => {
            translationStore.setState(translations);
        });

    return Observable
        .combineLatest(
            getLocales(),
            translationStore,
            (...data) => Object.assign({
                objectToTranslate: model,
                setTranslations(translations) {
                    translationStore.setState({
                        translations,
                    });
                },
            }, ...data),
        );
}

export function getTranslationFormFor(model) {
    return withStateFrom(getTranslationFormData(model), TranslationForm);
}

class TranslationForm extends Component {
    constructor(props, context) {
        super(props, context);

        const i18n = this.context.d2.i18n;
        this.getTranslation = i18n.getTranslation.bind(i18n);
    }

    state = {
        loading: true,
        translations: {},
        translationValues: {},
        currentSelectedLocale: '',
    };

    getLoadingdataElement() {
        return (
            <div style={{ textAlign: 'center' }}>
                <CircularProgress mode="indeterminate" />
            </div>
        );
    }

    renderFieldsToTranslate() {
        return this.props.fieldsToTranslate
            .filter(fieldName => fieldName)
            .map(fieldName => (
                <div key={fieldName}>
                    <TextField
                        floatingLabelText={this.getTranslation(camelCaseToUnderscores(fieldName))}
                        value={this.getTranslationValueFor(fieldName)}
                        fullWidth
                        onChange={this.setValue.bind(this, fieldName)}
                    />
                    <div>{this.props.objectToTranslate[fieldName]}</div>
                </div>
            ));
    }

    renderForm() {
        return (
            <div>
                {this.renderFieldsToTranslate()}
                <RaisedButton
                    label={this.getTranslation('save')}
                    primary
                    onClick={this.saveTranslations}
                />
                <RaisedButton
                    style={{ marginLeft: '1rem' }}
                    label={this.getTranslation('cancel')}
                    onClick={this.props.onCancel}
                />
            </div>
        );
    }

    renderHelpText() {
        return (
            <div>
                <p>{this.getTranslation('select_a_locale_to_enter_translations_for_that_language')}</p>
            </div>
        );
    }

    render() {
        if (!this.props.locales && !this.props.translations) {
            return this.getLoadingdataElement();
        }

        return (
            <div style={{ minHeight: 250 }}>
                <LocaleSelector locales={this.props.locales} onChange={this.setCurrentLocale} />
                {this.state.currentSelectedLocale ? this.renderForm() : this.renderHelpText()}
            </div>
        );
    }

    getTranslationValueFor(fieldName) {
        const translation = this.props.translations
            .find(t =>
                t.locale === this.state.currentSelectedLocale &&
                t.property.toLowerCase() === camelCaseToUnderscores(fieldName),
            );

        if (translation) {
            return translation.value;
        }
    }

    setCurrentLocale = (locale) => {
        this.setState({
            currentSelectedLocale: locale,
        });
    }

    setValue = (property, event) => {
        let newTranslations = [].concat(this.props.translations);
        let translation = newTranslations
            .find(t => t.locale === this.state.currentSelectedLocale && t.property.toLowerCase() === camelCaseToUnderscores(property));

        if (translation) {
            if (event.target.value) {
                translation.value = event.target.value;
            } else {
                // Remove translation from the array
                newTranslations = newTranslations.filter(t => t !== translation);
            }
        } else {
            translation = {
                property: camelCaseToUnderscores(property).toUpperCase(),
                locale: this.state.currentSelectedLocale,
                value: event.target.value,
            };

            newTranslations.push(translation);
        }

        this.props.setTranslations(newTranslations);
    }

    saveTranslations = () => {
        saveTranslations(this.props.objectToTranslate, this.props.translations)
            .subscribe(
                this.props.onTranslationSaved,
                this.props.onTranslationError,
            );
    }
}

TranslationForm.propTypes = {
    onTranslationSaved: PropTypes.func.isRequired,
    onTranslationError: PropTypes.func.isRequired,
    objectToTranslate: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    fieldsToTranslate: PropTypes.arrayOf(PropTypes.string),
};

TranslationForm.defaultProps = {
    fieldsToTranslate: ['name', 'shortName', 'description'],
};

TranslationForm.contextTypes = {
    d2: PropTypes.object,
};

export default TranslationForm;
