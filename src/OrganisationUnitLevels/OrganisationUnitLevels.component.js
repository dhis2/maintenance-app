import PropTypes from 'prop-types';
import { Component } from 'react';
import { addD2Context } from '@dhis2/d2-ui-core';
import organisationUnitLevelsStore from './organisationUnitLevels.store';
import { withStateFrom } from '@dhis2/d2-ui-core';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import { FormBuilder } from '@dhis2/d2-ui-forms';
import actions from './organisationUnitLevels.actions';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper/Paper';
import SaveButton from '../EditModel/SaveButton.component';
import FormButtons from '../EditModel/FormButtons.component';
import snackActions from '../Snackbar/snack.actions';
import { Heading } from '@dhis2/d2-ui-core';
import TranslationDialog from '@dhis2/d2-ui-translation-dialog';

function saveOrganisationUnitLevels(i18n) {
    actions.saveOrganisationUnitLevels()
        .subscribe(
            () => snackActions.show({ message: i18n.getTranslation('organisation_unit_levels_save_success') }),
            () => snackActions.show({ message: i18n.getTranslation('organisation_unit_levels_save_failed'), action: 'ok' })
        );
}

function OrganisationUnitLevels(props, context) {
    const canEdit = context.d2.currentUser.canUpdate(context.d2.models.organisationUnitLevel);

    if (props.isLoading) {
        return (
            <LinearProgress />
        );
    }

    const styles = {
        paperWrap: {
            padding: '4rem 5rem',
            maxWidth: 700,
            marginTop: '2rem',
        },
        rowStyle: {
            display: 'flex',
            flexDirection: 'row',
            height: '5rem',
        },
        formWrapStyle: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
        },
        fieldWrapStyle: {
            flex: 1,
            paddingRight: '1rem',
        },
        translateButtonWrap: {
            alignItems: 'flex-end',
            display: 'flex',
            flex: '5rem',
            height: '5rem',
            verticalAlign: 'middle',
        },
    };

    const fieldRows = props.fieldsForOrganisationUnitLevel.map((fieldsForLevel, index) => {
        let translateButton = null;
        if (fieldsForLevel.organisationUnitLevel.id && canEdit) {
            translateButton = (
                <div style={styles.translateButtonWrap}>
                    <IconButton iconClassName="material-icons" onClick={() => props.onTranslateClick(fieldsForLevel.organisationUnitLevel)}>translate</IconButton>
                </div>
            );
        }

        return (
            <div key={index} style={styles.rowStyle}>
                <FormBuilder
                    style={styles.formWrapStyle}
                    fieldWrapStyle={styles.fieldWrapStyle}
                    fields={fieldsForLevel.map(fieldConfig => ({
                        ...fieldConfig,
                        props: {
                            ...fieldConfig.props,
                            disabled: !canEdit,
                        },
                    }))}
                    onUpdateField={(fieldName, fieldValue) => {
                        actions.fieldUpdate({
                            organisationUnitLevel: fieldsForLevel.organisationUnitLevel,
                            fieldName,
                            fieldValue,
                        });
                    }}
                    onUpdateFormStatus={formStatus => actions.updateFormStatus({ levelIndex: index, formStatus })}
                />
                {translateButton}
            </div>
        );
    });

    return (
        <div>
            <Heading>{context.d2.i18n.getTranslation('organisation_unit_level_management')}</Heading>
            <Paper style={styles.paperWrap}>
                {fieldRows}
                <FormButtons>
                    {canEdit ? <SaveButton onClick={() => saveOrganisationUnitLevels(context.d2.i18n)} isValid={props.formStatus.every(v => v)} isSaving={props.isSaving} /> : []}
                </FormButtons>
            </Paper>
        </div>
    );
}
OrganisationUnitLevels.defaultProps = {
    fieldsForOrganisationUnitLevel: [],
    formStatus: [false],
    isLoading: true,
    isSaving: false,
};
OrganisationUnitLevels.propTypes = {
    fieldsForOrganisationUnitLevel: PropTypes.array,
    formStatus: PropTypes.array,
    isLoading: PropTypes.bool,
    isSaving: PropTypes.bool,
};

const componentState$ = organisationUnitLevelsStore;

const OrganisationUnitLevelsWithState = withStateFrom(componentState$, addD2Context(OrganisationUnitLevels));

export default addD2Context(class extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            translation: {
                open: false,
            },
        };
    }

    componentDidMount() {
        actions.initOrgUnitLevels();
    }

    render() {
        return (
            <div>
                <OrganisationUnitLevelsWithState onTranslateClick={this._onTranslateClick} />
                {this.state.translation.model ? <TranslationDialog
                    objectToTranslate={this.state.translation.model}
                    objectTypeToTranslate={this.state.translation.model && this.state.translation.model.modelDefinition}
                    open={this.state.translation.open}
                    onTranslationSaved={this._translationSaved}
                    onTranslationError={this._translationErrored}
                    onRequestClose={this._closeTranslationDialog}
                    fieldsToTranslate={['name']}
                /> : null }
            </div>
        );
    }

    _onTranslateClick = data => {
        const model = this.context.d2.models.organisationUnitLevel.create(data);

        this.setState({
            translation: {
                open: true,
                model,
            },
        });
    };

    _translationSaved = () => {
        snackActions.show({ message: this.context.d2.i18n.getTranslation('translation_saved') });
    };

    _translationErrored = () => {
        snackActions.show({ message: this.context.d2.i18n.getTranslation('translation_save_error'), action: 'ok' });
    };

    _closeTranslationDialog = () => {
        this.setState({
            translation: {
                open: false,
                model: undefined,
            },
        });
    };
});
