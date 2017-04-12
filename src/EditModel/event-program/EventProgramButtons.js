import React from 'react';
import EventActionButtons from './EventActionButtons';
import { EventProgramStepperNavigationBackward, EventProgramStepperNavigationForward } from './EventProgramStepperNavigationButtons';

const styles = {
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '1rem',
    },
};

const EventProgramButtons = ({ groupName, schema }) => {
    return (
        <div style={styles.buttons}>
            <EventProgramStepperNavigationBackward />
            <EventActionButtons groupName={groupName} schema={schema} />
            <EventProgramStepperNavigationForward />
        </div>
    );
};


export default EventProgramButtons;
