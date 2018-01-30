import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import mapPropsStream from 'recompose/mapPropsStream';
import FormHeading from '../../FormHeading';
import FormSubHeading from '../../FormSubHeading';
import EventProgramStepper from './TrackerProgramStepper';
import TrackerProgramStepperContent from './TrackerProgramStepperContent';
import eventProgramStore$, { isStoreStateDirty } from '../eventProgramStore';
import EventActionButtons from '../EventActionButtons';
import {
    createConnectedForwardButton,
    createConnectedBackwardButton,
    createStepperNavigation,
} from '../../stepper/stepper';
import { previousStep, nextStep } from '../actions';

const EventProgramStepperNavigationForward = createConnectedForwardButton(
    nextStep
);
const EventProgramStepperNavigationBackward = createConnectedBackwardButton(
    previousStep
);

const StepperNavigation = createStepperNavigation(
    EventProgramStepperNavigationBackward,
    EventProgramStepperNavigationForward
);

const styles = {
    heading: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
    },
};

const isModelDirty = () => ({
    dirty: isStoreStateDirty(eventProgramStore$.getState()),
});

function EditTrackerProgram(props) {
    const schema = props.params.modelType || 'program';
    const { groupName } = props.params;

    return (
        <div>
            <div style={styles.heading}>
                <FormHeading
                    schema={schema}
                    groupName={groupName}
                    isDirtyHandler={isModelDirty}
                >
                    {`tracker_${camelCaseToUnderscores(schema)}`}
                </FormHeading>
                <FormSubHeading>
                    {props.model.displayName}
                </FormSubHeading>
            </div>
            <div>
                <EventProgramStepper />
            </div>
            <TrackerProgramStepperContent schema={schema} {...props} />
            {!props.isProgramStageStepperActive &&
                <StepperNavigation>
                    <EventActionButtons
                        groupName={groupName}
                        schema={schema}
                        isDirtyHandler={isModelDirty}
                    />
                </StepperNavigation>}
        </div>
    );
}

export default EditTrackerProgram;
