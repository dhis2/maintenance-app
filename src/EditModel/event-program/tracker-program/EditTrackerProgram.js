import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import mapPropsStream from 'recompose/mapPropsStream';
import FormHeading from '../../FormHeading';
import FormSubHeading from '../../FormSubHeading';
import EventProgramStepper from './TrackerProgramStepper';
import TrackerProgramStepperContent from './TrackerProgramStepperContent';
import eventProgramStore$ from './trackerProgramStore';
import EventActionButtons from '../EventActionButtons';
import { createConnectedForwardButton, createConnectedBackwardButton, createStepperNavigation } from '../../stepper/stepper';
import { previousStep, nextStep } from '../actions';

const EventProgramStepperNavigationForward = createConnectedForwardButton(nextStep);
const EventProgramStepperNavigationBackward = createConnectedBackwardButton(previousStep);

const StepperNavigation = createStepperNavigation(EventProgramStepperNavigationBackward, EventProgramStepperNavigationForward);

const withPreLoadedModel = mapPropsStream(props$ => props$
    .combineLatest(
        eventProgramStore$,
        (props, eventProgramState) => ({ ...props, model: eventProgramState.program })
    )
);

const styles = {
    heading: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
    },
};

function EditTrackerProgram(props) {
    const schema = props.params.modelType || 'program';
    const { groupName } = props.params;

    return (
        <div>
            <div style={styles.heading}>
                <FormHeading schema={schema} groupName={groupName}>{camelCaseToUnderscores(schema) + "_with_registration"}</FormHeading>
                <FormSubHeading>{props.model.displayName}</FormSubHeading>
            </div>
            <div>
                <EventProgramStepper />
            </div>
            <TrackerProgramStepperContent
                schema={schema}
                {...props}
            />
            {!props.isProgramStageStepperActive && (
            <StepperNavigation>
                <EventActionButtons groupName={groupName} schema={schema} />
            </StepperNavigation>)}
        </div>
    );
}

export default EditTrackerProgram;
