import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash/fp';
import { camelCaseToUnderscores } from 'd2-utilizr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mapPropsStream from 'recompose/mapPropsStream';
import compose from 'recompose/compose';

import Paper from 'material-ui/Paper/Paper';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import FormHeading from '../FormHeading';
import FormSubHeading from '../FormSubHeading';
import ProgramIndicatorActionButtons from './ProgramIndicatorActionButtons';
import ProgramIndicatorStepper from './ProgramIndicatorStepper';

import fieldGroups from '../../config/field-config/field-groups';
import programIndicatorStore from './programIndicatorStore';
import { fieldConfigsSelector, isLoadingSelector, isSavingSelector } from './selectors';
import { previousStep, nextStep, editFieldChanged, saveAndValidateProgramIndicator } from './actions';
import {
    createConnectedForwardButton,
    createConnectedBackwardButton,
    createStepperNavigation,
} from '../stepper/stepper';

const styles = {
    heading: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
    },
    formWrapper: {
        padding: '3rem',
    },
};

const EventProgramStepperNavigationForward = createConnectedForwardButton(nextStep);
const EventProgramStepperNavigationBackward = createConnectedBackwardButton(previousStep);

const StepperNavigation = createStepperNavigation(
    EventProgramStepperNavigationBackward,
    EventProgramStepperNavigationForward,
);

class EditProgramIndicator extends Component {
    onSaveWithValidation = () => {
        this.props.saveAndValidateProgramIndicator(
            this.props.fieldConfigs,
            this.formRef,
        );
    }

    setFormRef = (ref) => {
        this.formRef = ref;
    }

    render() {
        const schema = 'programIndicator';
        const { groupName } = this.props.params;
        const programIndicatorName = get('name', this.props.programIndicator);
        const programName = get('program.displayName', this.props.programIndicator);

        const programAndIndicatorName = (programIndicatorName && programName) &&
            `${programIndicatorName} for ${programName}`;

        return (
            <div style={styles.navigationWrap}>
                <div style={styles.heading}>
                    <FormHeading schema={schema} groupName={groupName}>{camelCaseToUnderscores(schema)}</FormHeading>
                    <FormSubHeading>{programAndIndicatorName}</FormSubHeading>
                </div>
                <ProgramIndicatorStepper steps={fieldGroups.for(schema)} />
                {!this.props.isLoading &&
                    <Paper style={styles.formWrapper}>
                        <FormBuilder
                            fields={this.props.fieldConfigs}
                            onUpdateField={this.props.editFieldChanged}
                            ref={this.setFormRef}
                        />
                    </Paper>
                }
                <StepperNavigation>
                    <ProgramIndicatorActionButtons
                        onSaveAction={this.onSaveWithValidation}
                        groupName={groupName}
                        schema={schema}
                        isSaving={this.props.isSaving}
                    />
                </StepperNavigation>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    editFieldChanged,
    saveAndValidateProgramIndicator,
}, dispatch);

const mapStateToProps = state => ({
    fieldConfigs: fieldConfigsSelector(state),
    isLoading: isLoadingSelector(state),
    isSaving: isSavingSelector(state),
});

const withPreLoadedModel = compose(
    connect(mapStateToProps, mapDispatchToProps),
    mapPropsStream(props$ => props$
        .combineLatest(
            programIndicatorStore,
            (props, programIndicatorState) => ({
                ...props,
                programIndicator: programIndicatorState.programIndicator,
            }),
        ),
    ),
);

EditProgramIndicator.propTypes = {
    programIndicator: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    fieldConfigs: PropTypes.array.isRequired,
    editFieldChanged: PropTypes.func.isRequired,
    saveAndValidateProgramIndicator: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
};

export default withPreLoadedModel(EditProgramIndicator);
