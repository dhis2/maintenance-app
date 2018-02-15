import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { __, first, get, noop, pick } from 'lodash/fp';
import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import mapPropsStream from 'recompose/mapPropsStream';
import NotificationList from './NotificationList';
import {
    getProgramStages,
    getProgramNotifications,
    getProgramStageDataElementsByStageId,
    getStageNotifications,
    getProgramStageDataElements,
    getStageNotificationsForProgramStageId,
} from './selectors';
import NotificationDeleteDialog from './NotificationDeleteDialog';
import { removeStageNotification, setEditModel, setAddModel } from './actions';
import NotificationDialog from './NotificationDialog';
import eventProgramStore from '../eventProgramStore';
import { getCurrentProgramStageId } from '../tracker-program/program-stages/selectors';
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import { hideIfNotAuthorizedToCreate } from '../notifications/NotificationList';
const programStageTabIndex = 0;
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { getProgramStageById } from '../tracker-program/program-stages/selectors';

const programStages$ = eventProgramStore.map(getProgramStages);
const stageNotifications$ = eventProgramStore.map(
    get('programStageNotifications')
);
//const stageNotifications$ = stageId =>
//   eventProgramStore.map(getStageNotificationsByProgramStageId(stageId));
const programNotifications$ = eventProgramStore
    .map(getProgramNotifications)
    .map(n => n.toArray());
const programStageDataElementsById$ = stageId =>
    eventProgramStore.map(getProgramStageDataElementsByStageId(stageId));
const programStageDataElements$ = eventProgramStore.map(
    getProgramStageDataElements
);

const availableDataElements = eventProgramStore.map(
    get('availableDataElements')
);

class TrackerNotificationAddButton extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log(context);
        this.state = {
            items: [
                {
                    id: 'PROGRAM_NOTIFICATION',
                    primaryText: context.d2.i18n.getTranslation(
                        'program_notification'
                    ),
                    rightAvatar: (
                        <Avatar
                            className="material-icons"
                            icon={<FontIcon>event</FontIcon>}
                        />
                    ),
                },
                {
                    id: 'PROGRAM_STAGE_NOTIFICATION',
                    primaryText: context.d2.i18n.getTranslation(
                        'program_stage_notification'
                    ),
                    rightAvatar: (
                        <Avatar
                            className="material-icons"
                            icon={<FontIcon>event_note</FontIcon>}
                        />
                    ),
                },
            ],
            open: false,
        };
    }

    handleOpen = ({ isOpen }) => {
        this.setState({
            ...this.state,
            open: isOpen,
        });
    };

    handleItemClick = (item, event) => {
        this.setState({
            ...this.state,
            open: false,
        });

        this.props.onAddClick(item);
    };

    render() {
        return (
            <SpeedDial
                hasBackdrop={true}
                isOpen={this.state.open}
                onChange={this.handleOpen}
            >
                <BubbleList>
                    {this.state.items.map((item, index) =>
                        <BubbleListItem
                            key={item.id}
                            {...item}
                            onClick={this.handleItemClick.bind(this, item.id)}
                        />
                    )}
                </BubbleList>
            </SpeedDial>
        );
    }
}

TrackerNotificationAddButton.propTypes = {
    onAddClick: PropTypes.func.isRequired,
};

const TrackerNotificationAddButtonWithContext = hideIfNotAuthorizedToCreate(
    addD2Context(TrackerNotificationAddButton)
);

const TrackerProgramNotifications = (
    {
        programStages,
        programStageNotifications,
        programNotifications,
        askForConfirmation,
        onCancel,
        onDelete,
        open,
        setOpen,
        modelToDelete,
        setEditProgramModel,
        setEditProgramStageModel,
        setAddModel,
        availableDataElements,
        model,
        ...props
    },
    { d2 }
) => {
    const stageNotificationsWithStageNames = [];

    //Flatten stageNotifications to be a list of notifications
    //with reference to the programStage
    for (let stageId in programStageNotifications) {
        const notifications = programStageNotifications[stageId];

        const programStage = props.getProgramStageById(stageId);
        const programStageProps = pick(['displayName', 'id'], programStage);

        notifications.forEach(nf => {
            nf.programStage = programStageProps;
            stageNotificationsWithStageNames.push(nf);
        });
    }
    return (
        <div>
            <Tabs initialSelectedIndex={programStageTabIndex}>
                <Tab
                    label={d2.i18n.getTranslation(
                        'program_stage_notifications'
                    )}
                >
                    <NotificationList
                        showProgramStage
                        notifications={stageNotificationsWithStageNames}
                        onRemoveNotification={askForConfirmation}
                        onEditNotification={setEditProgramStageModel}
                        onAddNotification={setAddModel}
                        showAddButton={true}
                        addButton={TrackerNotificationAddButtonWithContext}
                    />
                </Tab>
                <Tab label={d2.i18n.getTranslation('program_notifications')}>
                    <NotificationList
                        notifications={programNotifications}
                        onRemoveNotification={askForConfirmation}
                        onEditNotification={setEditProgramModel}
                        onAddNotification={setAddModel}
                        showAddButton={false}
                    />
                </Tab>
            </Tabs>
            <NotificationDialog
                availableDataElements={availableDataElements}
                isTracker
                program={model}
                programStages={programStages}
            />
            <NotificationDeleteDialog
                setOpen={setOpen}
                open={open}
                onCancel={onCancel}
                onConfirm={onDelete}
                name={modelToDelete && modelToDelete.name}
            />
        </div>
    );
};

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
};

TrackerProgramNotifications.contextTypes = {
    d2: PropTypes.object,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            removeStageNotification,
            setEditProgramStageModel: (model) =>
                setEditModel(model, 'PROGRAM_STAGE_NOTIFICATION'),
            setEditProgramModel: (model) =>
                setEditModel(model, 'PROGRAM_NOTIFICATION'),
            setAddModel,
        },
        dispatch
    );

const enhance = compose(
    // TODO: Impure connect when the reducer is fixed to emit a pure model this can be a pure action
    connect(state => ({}), mapDispatchToProps, undefined, { pure: false }),
    withState('open', 'setOpen', false),
    withState('modelToDelete', 'setModelToDelete', null),
    withHandlers({
        onCancel: ({ setOpen }) => () => setOpen(false),
        onDelete: ({
            setOpen,
            removeStageNotification,
            modelToDelete,
        }) => () => {
            setOpen(false);
            removeStageNotification(modelToDelete);
        },
        askForConfirmation: ({ setOpen, setModelToDelete }) => model => {
            setModelToDelete(model);
            setOpen(true);
        },
    }),
    mapPropsStream(props$ =>
        props$.combineLatest(
            programStages$,
            stageNotifications$,
            programNotifications$,
            availableDataElements,
            eventProgramStore,
            (
                props,
                programStages,
                programStageNotifications,
                programNotifications,
                availableDataElements,
                store
            ) => {
                return {
                    ...props,
                    programStages,
                    programStageNotifications,
                    programNotifications,
                    availableDataElements,
                    getProgramStageById: getProgramStageById(store),
                };
            }
        )
    )
);

export default enhance(TrackerProgramNotifications);
