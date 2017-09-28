import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import mapPropsStream from 'recompose/mapPropsStream';
import FormHeading from '../FormHeading';
import FormSubHeading from '../FormSubHeading';
import EventProgramStepper from './EventProgramStepper';
import EventProgramStepperContent from './EventProgramStepperContent';
import eventProgramStore$ from './eventProgramStore';
import EventActionButtons from './EventActionButtons';
import { createConnectedForwardButton, createConnectedBackwardButton, createStepperNavigation } from '../stepper/stepper';
import { previousStep, nextStep } from './actions';

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

function EditEventProgram(props) {
    const schema = props.params.modelType || 'program';
    const { groupName } = props.params;

    return (
        <div>
            <div style={styles.heading}>
                <FormHeading schema={schema} groupName={groupName}>{camelCaseToUnderscores(schema)}</FormHeading>
                <FormSubHeading>{props.model.displayName}</FormSubHeading>
            </div>
            <div>
                <EventProgramStepper />
            </div>
            <EventProgramStepperContent
                schema={schema}
                {...props}
            />
            <StepperNavigation>
                <EventActionButtons groupName={groupName} schema={schema} />
            </StepperNavigation>
        </div>
    );
}

export default withPreLoadedModel(EditEventProgram);
