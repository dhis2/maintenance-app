import React from 'react';
import { camelCaseToUnderscores } from 'd2-utilizr';
import mapPropsStream from 'recompose/mapPropsStream';
import Paper from 'material-ui/Paper';
import { bindActionCreators } from 'redux';
import modelToEditStore from '../modelToEditStore';
import { StepperNavigationButtons } from './stepper';
import { previousStep, nextStep } from './actions';
import FormHeading from '../FormHeading';
import FormSubHeading from '../FormSubHeading';
import { Provider, connect } from 'react-redux';
import EventProgramStepper from './EventProgramStepper';
import EventProgramStepperContent from './EventProgramStepperContent';
import eventProgramStore from './store';

import IconButton from 'material-ui/IconButton/IconButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

const withPreLoadedModel = mapPropsStream(props$ => props$.combineLatest(modelToEditStore, (props, model) => ({ ...props, model})));

const a_styles = {
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
};

const EventProgramStepperNavigationButtons = connect(
    () => ({ style: { margin: '1rem' } }),
    dispatch => bindActionCreators({ onBackClick: previousStep, onForwardClick: nextStep }, dispatch)
)(StepperNavigationButtons);

const EventProgramButtons = () => {
    return (
        <div style={a_styles.buttons}>
            <IconButton>
                <SaveIcon />
            </IconButton>
            <IconButton>
                <CloseIcon />
            </IconButton>
        </div>
    );
};

const styles = {
    paperContent: {
        padding: '3rem',
    }
};

function EditEventProgram(props) {
    const schema = props.params.modelType || 'program';
    console.log(props.model);

    return (
        <Provider store={eventProgramStore}>
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                    <FormHeading schema={schema}>{camelCaseToUnderscores(schema)}</FormHeading>
                    <FormSubHeading>{props.model.displayName}</FormSubHeading>
                </div>
                <div>
                    <EventProgramStepper />
                    <EventProgramButtons />
                </div>
                <Paper>
                    <div style={styles.paperContent}>
                        <EventProgramStepperContent schema={schema} {...props} />
                    </div>
                </Paper>
                <EventProgramStepperNavigationButtons />
            </div>
        </Provider>
    );
}

export default withPreLoadedModel(EditEventProgram);
