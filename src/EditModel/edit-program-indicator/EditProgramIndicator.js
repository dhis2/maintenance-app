import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import { get } from 'lodash/fp';
import mapPropsStream from 'recompose/mapPropsStream';

import FormHeading from '../form-heading/FormHeading';
import FormSubHeading from '../form-heading/FormSubHeading';
import ProgramIndicatorStepper from './ProgramIndicatorStepper';
import ProgramIndicatorStepperContent from './ProgramIndicatorStepperContent';
import ProgramIndicatorActionButtons from './ProgramIndicatorActionButtons';

import programIndicatorStore from './programIndicatorStore';
import { previousStep, nextStep } from './actions';
import {
    createConnectedForwardButton,
    createConnectedBackwardButton,
    createStepperNavigation,
} from '../stepper/stepper';


const EventProgramStepperNavigationForward = createConnectedForwardButton(nextStep);
const EventProgramStepperNavigationBackward = createConnectedBackwardButton(previousStep);

const StepperNavigation = createStepperNavigation(EventProgramStepperNavigationBackward, EventProgramStepperNavigationForward);

const withPreLoadedModel = mapPropsStream(props$ => props$
    .combineLatest(
        programIndicatorStore,
        (props, programIndicatorState) => ({
            ...props,
            programIndicator: programIndicatorState.programIndicator,
        }),
    ),
);

const styles = {
    heading: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
    },
};

function EditProgramIndicator({ programIndicator, ...props }) {
    const schema = 'programIndicator';
    const { groupName } = props.params;

    const programIndicatorName = get('name', programIndicator);
    const programName = get('program.displayName', programIndicator);

    return (
        <div style={styles.navigationWrap}>

            <div style={styles.heading}>
                <FormHeading schema={schema} groupName={groupName}>
                    {camelCaseToUnderscores(schema)}
                </FormHeading>

                <FormSubHeading>
                    {(programIndicatorName && programName)
                        && `${programIndicatorName} for ${programName}`}
                </FormSubHeading>
            </div>

            <ProgramIndicatorStepper />
            <ProgramIndicatorStepperContent
                schema={schema}
                {...props}
            />
            <StepperNavigation>
                <ProgramIndicatorActionButtons groupName={groupName} schema={schema} />
            </StepperNavigation>
        </div>
    );
}

export default withPreLoadedModel(EditProgramIndicator);
