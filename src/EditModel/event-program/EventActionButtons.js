import React from 'react';
import IconButton from 'material-ui/IconButton/IconButton';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import { goToAndScrollUp } from '../../router-utils';

export default function EventActionButtons({ groupName }) {
    return (
        <div>
            <IconButton>
                <SaveIcon />
            </IconButton>
            <FlatButton onClick={() => goToAndScrollUp(`/list/${groupName}/${schema}`)}>
                Close
            </FlatButton>
        </div>
    );
}
