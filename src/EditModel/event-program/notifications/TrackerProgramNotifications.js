import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { __, first, get, toArray } from 'lodash/fp';
import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import mapPropsStream from 'recompose/mapPropsStream';

import NotificationList from './NotificationList';
import { getStageNotifications, getProgramNotifications, getProgramStageDataElements } from './selectors';
import NotificationDeleteDialog from './NotificationDeleteDialog';
import { removeStageNotification, setEditModel, setAddModel } from './actions';
import NotificationDialog from './NotificationDialog';
import eventProgramStore from '../eventProgramStore';

const programStageTabIndex = 0;

const stageNotifications$ = eventProgramStore.map(getStageNotifications);
const programNotifications$ = eventProgramStore.map(getProgramNotifications).map(n => n.toArray());
const programStageDataElements$ = eventProgramStore.map(getProgramStageDataElements);

const TrackerProgramNotifications = ({ stageNotifications, programNotifications, askForConfirmation, onCancel, onDelete, open, setOpen,
                                       modelToDelete, setEditModel, setAddModel, dataElements }, { d2 }) => {
    return (
        <div>
            <Tabs initialSelectedIndex={programStageTabIndex}>
                <Tab label={d2.i18n.getTranslation('program_stage_notifications')}>
                    <NotificationList
                        notifications={stageNotifications}
                        onRemoveNotification={askForConfirmation}
                        onEditNotification={setEditModel}
                        onAddNotification={setAddModel}
                    />
                    <NotificationDialog dataElements={dataElements} />
                </Tab>

                <Tab label={d2.i18n.getTranslation('program_notifications')}>
                    <NotificationList
                        notifications={programNotifications}
                        onRemoveNotification={askForConfirmation}
                        onEditNotification={setEditModel}
                        onAddNotification={setAddModel}
                    />
                    <NotificationDialog dataElements={dataElements} />
                </Tab>
            </Tabs>
            <NotificationDeleteDialog
                setOpen={setOpen}
                open={open}
                onCancel={onCancel}
                onConfirm={onDelete}
                name={modelToDelete && modelToDelete.name}
            />
        </div>
    );
}

TrackerProgramNotifications.propTypes = {
    stageNotifications: PropTypes.any.isRequired,
    programNotifications: PropTypes.any.isRequired,
    askForConfirmation: PropTypes.any.isRequired,
    onCancel: PropTypes.any.isRequired,
    onDelete: PropTypes.any.isRequired,
    open: PropTypes.any.isRequired,
    setOpen: PropTypes.any.isRequired,
    modelToDelete: PropTypes.any,
    setEditModel: PropTypes.any.isRequired,
    setAddModel: PropTypes.any.isRequired,
    dataElements: PropTypes.any.isRequired,
};

TrackerProgramNotifications.contextTypes = {
    d2: PropTypes.object,
};

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
        .combineLatest(
            stageNotifications$,
            programNotifications$,
            programStageDataElements$,
            (props, stageNotifications, programNotifications, dataElements) =>
                ({ ...props, stageNotifications, programNotifications, dataElements })
        ),
    ),
);

export default enhance(TrackerProgramNotifications);
