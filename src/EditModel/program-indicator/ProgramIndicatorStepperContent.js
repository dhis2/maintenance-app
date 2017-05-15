import { connect } from 'react-redux';
import { createStepperContentFromConfig  } from '../event-program/stepper';
import { activeStepSelector } from './selectors';
import steps from './program-indicator-steps';
// import eventProgramStore from './eventProgramStore';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';

const programIndicator$ = Observable.of({});

const mapStateToProps = (state) => ({
    activeStep: activeStepSelector(state),
});

const EventProgramStepperContent =
    compose(
        connect(mapStateToProps),
        mapPropsStream(props$ =>
            props$.combineLatest(programIndicator$, (props, { program }) => ({ ...props, modelToEdit: program }))
        )
    )
    (createStepperContentFromConfig(steps));

export default EventProgramStepperContent;
