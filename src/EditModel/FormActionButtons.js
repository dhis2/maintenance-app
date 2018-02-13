import React from 'react';
import { connect } from 'react-redux';
import withProps from 'recompose/withProps';
import { compose } from 'lodash/fp';
import SaveButton from './SaveButton.component';
import CancelButton from './CancelButton.component';
import { goToAndScrollUp } from '../router-utils';
import eventProgramStore from './event-program/eventProgramStore';

const styles = {
    cancelButton: {
        marginLeft: '1rem',
    },
};

// TODO: Make the isValid prop actually useful..
export default function FormActionButtons({ onSaveAction, onCancelAction, isDirtyHandler }) {
    return (
        <div>
            <SaveButton onClick={onSaveAction} isValid />
            <CancelButton onClick={onCancelAction} isDirtyHandler={isDirtyHandler} style={styles.cancelButton} />
        </div>
    );
}

export function createConnectedFormActionButtonsForSchema(mapDispatchToProps, isDirtyHandler) {
    const onCancelActionCreator = (groupName, schema) => () => goToAndScrollUp(`/list/${groupName}/${schema}`);

    const enhance = compose(
        withProps(({ groupName, schema }, isDirtyHandler) => ({
            onCancelAction: onCancelActionCreator(groupName, schema),
        })),
        connect(undefined, mapDispatchToProps),
    );

    return enhance(FormActionButtons);
}
