import React from 'react';
import { goToAndScrollUp } from '../../router-utils';
import IconButton from 'material-ui/IconButton/IconButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

const styles = {
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
};

const EventProgramButtons = ({ groupName, schema }) => {
    return (
        <div style={styles.buttons}>
            <IconButton>
                <SaveIcon />
            </IconButton>
            <IconButton onClick={() => goToAndScrollUp(`/list/${groupName}/${schema}`)}>
                <CloseIcon />
            </IconButton>
        </div>
    );
};


export default EventProgramButtons;
