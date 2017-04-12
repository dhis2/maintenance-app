import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import mapPropsStream from 'recompose/mapPropsStream';
import modelToEditStore from '../modelToEditStore';
import FormHeading from '../FormHeading';
import FormSubHeading from '../FormSubHeading';
import { Provider } from 'react-redux';
import EventProgramStepper from './EventProgramStepper';
import EventProgramStepperContent from './EventProgramStepperContent';
import eventProgramStore from './store';
import EventProgramButtons from './EventProgramButtons';

const withPreLoadedModel = mapPropsStream(props$ => props$.combineLatest(modelToEditStore, (props, model) => ({ ...props, model})));

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
        <Provider store={eventProgramStore}>
            <div>
                <div style={styles.heading}>
                    <FormHeading schema={schema}>{camelCaseToUnderscores(schema)}</FormHeading>
                    <FormSubHeading>{props.model.displayName}</FormSubHeading>
                </div>
                <div>
                    <EventProgramStepper />
                </div>
                <EventProgramStepperContent
                    schema={schema}
                    {...props}
                />
                <EventProgramButtons groupName={groupName} schema={schema} />
            </div>
        </Provider>
    );
}

export default withPreLoadedModel(EditEventProgram);
