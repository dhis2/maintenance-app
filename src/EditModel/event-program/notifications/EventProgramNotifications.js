import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import NotificationList from './NotificationList';
import { getStageNotifications } from './selectors';
import EventProgramStageNotificationDeleteDialog from './EventProgramStageNotificationDeleteDialog';
import EventProgramDeletionNotification from './EventProgramDeletionNotification';
import { removeStageNotification, setEditModel, setAddModel } from './actions';
import NotificationDialog from './NotificationDialog';

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
            <EventProgramDeletionNotification />
        </div>
    )
}

const mapDispatchToProps = dispatch => bindActionCreators({ removeStageNotification, setEditModel, setAddModel }, dispatch);
const mapStateToProps = (state) => ({
    notifications: Array.from(getStageNotifications(state.model).values()),
});

const enhance = compose(
    // TODO: Impure connect when the reducer is fixed to emit a pure model this can be a pure action
    connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false }),
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
        }
    })
);

export default enhance(EventProgramNotifications);
