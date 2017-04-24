import React from 'react';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { goToAndScrollUp } from '../../router-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveEventProgram } from './actions';
import SaveButton from '../SaveButton.component';

export function EventActionButtons({ groupName, schema, saveEventProgram }) {
    return (
        <div>
            <SaveButton onClick={saveEventProgram} isValid={true} />
            <FlatButton onClick={() => goToAndScrollUp(`/list/${groupName}/${schema}`)}>
                Close
            </FlatButton>
        </div>
    );
}

export default connect(undefined, (dispatch) => bindActionCreators({ saveEventProgram }, dispatch))(EventActionButtons);
