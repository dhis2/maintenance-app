import { useD2 } from '@dhis2/app-runtime-adapter-d2';
import PropTypes from 'prop-types';
import { Component, useEffect, useState } from 'react';
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

function OrganisationUnitLevels(props) {
    const { d2 } = useD2()

    if (props.isLoading || !d2) {
        return (
            <LinearProgress />
        );
    }

    const canEdit = d2.currentUser.canUpdate(d2.models.organisationUnitLevel);

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
            <Heading>{d2.i18n.getTranslation('organisation_unit_level_management')}</Heading>
            <Paper style={styles.paperWrap}>
                {fieldRows}
                <FormButtons>
                    {canEdit ? <SaveButton onClick={() => saveOrganisationUnitLevels(d2.i18n)} isValid={props.formStatus.every(v => v)} isSaving={props.isSaving} /> : []}
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

const OrganisationUnitLevelsWithState = withStateFrom(componentState$, OrganisationUnitLevels);

export default function OrganisationUnitLevelsWrapper() {
    const { d2 } = useD2();
    const [translationOpen, setTranslationOpen] = useState(false);
    const [translationModel, setTranslationModel] = useState(null);

    useEffect(() => {
        actions.initOrgUnitLevels();
    }, [])

    const onTranslateClick = data => {
        const model = d2.models.organisationUnitLevel.create(data);

        setTranslationModel(model)
        setTranslationOpen(true)
    };

    const translationSaved = () => {
        snackActions.show({
            message: d2.i18n.getTranslation('translation_saved'),
        });
    };

    const translationErrored = () => {
        snackActions.show({
            message: d2.i18n.getTranslation('translation_save_error'),
            action: 'ok',
        });
    };

    const closeTranslationDialog = () => {
        setTranslationOpen(false)
        setTranslationModel(null)
    };

    if (!d2) {
        return (
            <LinearProgress />
        );
    }

    return (
        <div>
            <OrganisationUnitLevelsWithState
                onTranslateClick={onTranslateClick}
            />

            {translationModel ? <TranslationDialog
                d2={d2}
                objectToTranslate={translationModel}
                objectTypeToTranslate={translationModel && translationModel.modelDefinition}
                open={translationOpen}
                onTranslationSaved={translationSaved}
                onTranslationError={translationErrored}
                onRequestClose={closeTranslationDialog}
                fieldsToTranslate={['name']}
            /> : null }
        </div>
    );
}
