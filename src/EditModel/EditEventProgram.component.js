import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import FormHeading from './FormHeading';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import EventProgramStepper from './event-program/EventProgramStepper';
import EventProgramStepperContent from './event-program/EventProgramStepperContent';

function eventProgramReducer(state = { activeStep: 'details' }, action) {
    if ('STEP_CHANGE' === action.type) {
        return {
            activeStep: action.payload,
        };
    }
    return state;
}

const eventProgramStore = createStore(eventProgramReducer);

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
