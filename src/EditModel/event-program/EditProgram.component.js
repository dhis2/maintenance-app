import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import mapPropsStream from 'recompose/mapPropsStream';
import eventProgramStore$ from './eventProgramStore';
import { connect } from 'react-redux';
import {
    createConnectedForwardButton,
    createConnectedBackwardButton,
    createStepperNavigation
} from '../stepper/stepper';
import { previousStep, nextStep } from './actions';
import EditEventProgram from './EditEventProgram.component';
import EditTrackerProgram from './tracker-program/EditTrackerProgram';
import LoadingMask from '../../loading-mask/LoadingMask.component';

const mapStateToProps = state => ({
    isLoading: state.eventProgram.step.isLoading
});

const spinnerWhileLoading = isLoading =>
    branch(isLoading, renderComponent(LoadingMask));

const enhance = compose(
    connect(mapStateToProps),
    mapPropsStream(props$ =>
        props$.combineLatest(
            eventProgramStore$,
            (props, eventProgramState) => ({
                ...props,
                model: eventProgramState.program
            })
        )
    ),
    spinnerWhileLoading(props => props.isLoading)
);

function EditProgram(props) {
    const schema = props.params.modelType || 'program';
    const { groupName } = props.params;
    console.log(props.model);
    console.log(props.model.programType);
    return props.model.programType === 'WITH_REGISTRATION'
        ? <EditTrackerProgram {...props} />
        : <EditEventProgram {...props} />;
}

export default enhance(EditProgram);
