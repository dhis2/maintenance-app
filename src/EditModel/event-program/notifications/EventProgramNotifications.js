import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import NotificationList from './NotificationList';
import { getStageNotifications } from './selectors';
import EventProgramStageNotificationDeleteDialog from './EventProgramStageNotificationDeleteDialog';
import { removeStageNotification, setEditModel, setAddModel } from './actions';
import NotificationDialog from './NotificationDialog';
import mapPropsStream from 'recompose/mapPropsStream';
import eventProgramStore from '../eventProgramStore';
import { __, first, get } from 'lodash/fp';

const notifications$ = eventProgramStore.map(getStageNotifications);

function EventProgramNotifications({ notifications, askForConfirmation, onCancel, onDelete, open, setOpen, modelToDelete, setEditModel, setAddModel }) {
    return (
        <div>
            <NotificationList
                notifications={notifications}
                onRemoveNotification={askForConfirmation}
                onEditNotification={setEditModel}
                onAddNotification={setAddModel}
            />
            <NotificationDialog />
            <EventProgramStageNotificationDeleteDialog
                setOpen={setOpen}
                open={open}
                onCancel={onCancel}
                onConfirm={onDelete}
                name={modelToDelete && modelToDelete.name}
            />
        </div>
    );
}

const mapDispatchToProps = dispatch => bindActionCreators({ removeStageNotification, setEditModel, setAddModel }, dispatch);

const enhance = compose(
    // TODO: Impure connect when the reducer is fixed to emit a pure model this can be a pure action
    connect(undefined, mapDispatchToProps, undefined, { pure: false }),
    withState('open', 'setOpen', false),
    withState('modelToDelete', 'setModelToDelete', null),
    withHandlers({
        onCancel: ({ setOpen }) => () => setOpen(false),
        onDelete: ({ setOpen, removeStageNotification, modelToDelete }) => () => {
            setOpen(false);
            removeStageNotification(modelToDelete);
        },
        askForConfirmation: ({ setOpen, setModelToDelete }) => (model) => {
            setModelToDelete(model);
            setOpen(true);
        },
    }),
    mapPropsStream(props$ => props$
        .combineLatest(notifications$, (props, notifications) => ({ ...props, notifications }))
    )
);

export default enhance(EventProgramNotifications);
