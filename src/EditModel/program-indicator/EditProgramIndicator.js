import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import mapPropsStream from 'recompose/mapPropsStream';
import FormHeading from '../FormHeading';
import FormSubHeading from '../FormSubHeading';
import { Provider } from 'react-redux';
import ProgramIndicatorStepper from './ProgramIndicatorStepper';
import ProgramIndicatorStepperContent from './ProgramIndicatorStepperContent';
import store from '../../store';
import programIndicatorStore from './programIndicatorStore';
import { get } from 'lodash/fp';
// import EventProgramButtons from './EventProgramButtons';

const withPreLoadedModel = mapPropsStream(props$ => props$
    .combineLatest(
        programIndicatorStore,
        (props, programIndicatorState) => ({
            ...props,
            programIndicator: programIndicatorState.programIndicator
        })
    )
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

    const programName = get('program.displayName', programIndicator);

    return (
        <Provider store={store}>
            <div>
                <div style={styles.heading}>
                    <FormHeading schema={schema}>{camelCaseToUnderscores(schema)}</FormHeading>
                    <FormSubHeading>{programName}</FormSubHeading>
                </div>
                <div>
                    <ProgramIndicatorStepper />
                </div>
                <ProgramIndicatorStepperContent
                    schema={schema}
                    {...props}
                />
                {/*<EventProgramButtons groupName={groupName} schema={schema} />*/}
            </div>
        </Provider>
    );
}

export default withPreLoadedModel(EditProgramIndicator);
