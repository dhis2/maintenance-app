import React from 'react';
import EditModel from './EditModel.component';
import { camelCaseToUnderscores } from 'd2-utilizr';
import FormHeading from './FormHeading';
import Stepper from 'material-ui/Stepper/Stepper';
import StepButton from 'material-ui/Stepper/StepButton';
import Step from 'material-ui/Stepper/Step';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import Translate from 'd2-ui/lib/i18n/Translate.component';

function eventProgramReducer(state = { activeStep: 'details' }, action) {
    if ('STEP_CHANGE' === action.type) {
        return {
            activeStep: action.payload,
        };
    }
    return state;
}

const eventProgramStore = createStore(eventProgramReducer);

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    stepperClicked: (v) => dispatch({ type: 'STEP_CHANGE', payload: v })
});

const steps = [
    {
        key: 'details',
        name: 'Add program details',
    },
    {
        key: 'data_elements',
        name: 'Assign data elements',
    },
    {
        key: 'data_entry_forms',
        name: 'Create data entry form',
    },
    {
        key: 'organisation_units',
        name: 'Assign organisation units',
    },
    {
        key: 'notifications',
        name: 'Create notifications',
    },
];

const createStepperWithFromConfig = (stepperConfig) => ({ activeStep, stepperClicked }) => (
    <Stepper linear={false}>
        {stepperConfig.map(step => (
            <Step key={step.key} active={activeStep === step.key}>
                <StepButton onClick={() => stepperClicked(step.key)}><Translate>{step.name}</Translate></StepButton>
            </Step>
        ))}
    </Stepper>
);

const StepperContent = ({ activeStep, schema, ...props }) => {
    switch (activeStep) {
        case 'details':
            return (
                <EditModel
                    groupName={props.params.groupName}
                    modelType={schema}
                    modelId={props.params.modelId}
                />
            );

        case 'data_elements':
            return (
                <div>Data element management</div>
            );

        case 'data_entry_forms':
            return (
                <div>Data entry form management</div>
            );

        case 'organisation_units':
            return (
                <div>Organisation units management</div>
            );

        case 'notifications':
            return (
                <div>Notifications management</div>
            );
    }

    return null;
};

const EventProgramStepper = connect(mapStateToProps, mapDispatchToProps)(createStepperWithFromConfig(steps));
const EventProgramStepperContent = connect(mapStateToProps)(StepperContent);

export default function EditEventProgram(props) {
    const schema = props.params.modelType || 'program';

    return (
        <Provider store={eventProgramStore}>
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                    <FormHeading schema={schema}>{camelCaseToUnderscores(schema)}</FormHeading>
                </div>
                <div>
                    <EventProgramStepper />
                </div>
                <EventProgramStepperContent schema={schema} {...props} />
            </div>
        </Provider>
    );
}
