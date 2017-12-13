import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeQuery } from '../../../../router-utils';
import fieldOrder from '../../../../config/field-config/field-order';
import { createFormFor } from '../../../formHelpers';
import { flattenRouterProps, wrapInPaper } from '../../../componentHelpers';
import eventProgramStore$ from '../../eventProgramStore';
import { get, isEqual } from 'lodash/fp';
import { changeStep } from '../../actions';
import { editProgramStageField } from './actions';
import mapPropsStream from 'recompose/mapPropsStream';
import compose from 'recompose/compose';
import { Observable } from 'rxjs';
import steps from './programStageSteps';
import { createStepperFromConfig } from '../../../stepper/stepper';
import { activeStepSelector } from '../../selectors';

const programStage$ = eventProgramStore$.map(get('programStages'));

const filteredProgram$ = programStage$.filter(
    stage => stage.id === 'A03MvHHogjR'
);
const program$ = eventProgramStore$.map(get('program'));

const mapDispatchToProps = (dispatch, ownProps) => {
    console.log(ownProps);
    return bindActionCreators(
        {
            editFieldChanged: (field, value) =>
                editProgramStageField(ownProps.programStage$, field, value)
        },
        dispatch
    );
};
//const connectEditForm = connect(null, mapDispatchToProps)

const programStageFields = fieldOrder.for('programStage');
const programStageById = id =>
    programStage$.flatMap(x => x).filter(v => v.id == id);

const enhance = mapPropsStream(props$ =>
    props$.combineLatest(
        props$.flatMap(x => x.programStage$),
        (props, programStage) => {
            return {
                ...props,
                programStage
            };
        }
    )
);

/*
const mapStateToProps = state => ({
    activeStep: state.eventProgram.programStageStepper.activeStep,
});

const mapDispatchToProps = dispatch => bindActionCreators({ stepperClicked: changeStep }, dispatch);
const EventProgramStepper = connect(mapStateToProps, mapDispatchToProps)(createStepperFromConfig(steps));


//const ProgramStageForm = connectEditForm(wrapInPaper(createFormFor(props.programStage$, 'programStage', programStageFields)));
const ProgramStageStepper = createStepperFromConfig(steps, 'vertical'); */

class ProgramStageStepper extends Component {
    constructor(props) {
        super();
        const connectEditForm = connect(null, dispatch =>
            bindActionCreators(
                {
                    editFieldChanged: (field, value) =>
                        editProgramStageField(props.programStage.id, field, value)
                },
                dispatch
            )
        );

        this.state = {
            formToRender: connectEditForm(
                wrapInPaper(
                    createFormFor(
                        props.programStage$,
                        'programStage',
                        programStageFields
                    )
                )
            )
        };
    }

    render() {
        const Component = this.state.formToRender;
        return <Component />;
    }
}
const ProgramStageStepperEnhanced = enhance(ProgramStageStepper);

const EditProgramStage = props => {
    return (
        <div>
            EDIT PROGRAM STAGE HERE
            <ProgramStageStepper
                programStage$={props.programStage$}
                programStage={props.programStage}
            />
            <button onClick={() => removeQuery('stage')}>Create stage</button>
        </div>
    );
};

export default enhance(EditProgramStage);
