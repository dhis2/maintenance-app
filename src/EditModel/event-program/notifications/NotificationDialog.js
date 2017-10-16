import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { createStepperFromConfig } from '../../stepper/stepper';
import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { modelToEditSelector } from './selectors';
import { setEditModel, setStageNotificationValue, saveStageNotification } from './actions';
import { bindActionCreators } from 'redux';
import { get } from 'lodash/fp';
import { createFieldConfigsFor } from '../../formHelpers';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import branch from 'recompose/branch';
import renderNothing from 'recompose/renderNothing';

const mapStateToProps = state => ({
    model: modelToEditSelector(state),
});

const _mapDispatchToProps = dispatch => ({
    onUpdateField(fieldName, value) {
        dispatch(setStageNotificationValue(fieldName, value));
    },
});

// TODO: Can not modify the fieldConfigs props as the FormBuilder will fail when it can not find old formConfigs. Therefore we'll need to return the same number of fieldConfigs
function skipLogicForNotificationTrigger(fieldConfigs = []) {
    const [notificationTriggerConfig, ...rest] = fieldConfigs;

    // The relativeScheduledDays field only makes sense if the notificationTrigger field is set to 'SCHEDULED_DAYS_DUE_DATE'
    if (notificationTriggerConfig.value !== 'SCHEDULED_DAYS_DUE_DATE') {
        const restRenderingNothing = rest.map(fieldConfig => ({ ...fieldConfig, component: renderNothing() }));
        return [notificationTriggerConfig, ...restRenderingNothing];
    }

    return [notificationTriggerConfig, ...rest];
}

// TODO: Can not modify the fieldConfigs props as the FormBuilder will fail when it can not find old formConfigs. Therefore we'll need to return the same number of fieldConfigs
function skipLogicForRecipients(fieldConfigs = []) {
    const [notificationRecipient, recipientUserGroup, deliveryChannels] = fieldConfigs;

    const recipientsWithDeliveryChannels = new Set(['TRACKED_ENTITY_INSTANCE', 'ORGANISATION_UNIT_CONTACT']);
    if (recipientsWithDeliveryChannels.has(notificationRecipient.value)) {
        return [
            notificationRecipient,
            { ...recipientUserGroup, component: renderNothing() },
            deliveryChannels,
        ];
    }

    if (notificationRecipient.value === 'USER_GROUP') {
        return [
            notificationRecipient,
            recipientUserGroup,
            { ...deliveryChannels, component: renderNothing() },
        ];
    }

    return [
        notificationRecipient,
        { ...recipientUserGroup, component: renderNothing() },
        { ...deliveryChannels, component: renderNothing() },
    ];
}

const steps = [
    {
        key: 'what',
        name: 'what_to_send',
        content: compose(
            connect(mapStateToProps, _mapDispatchToProps, undefined, { pure: false }),
            createFieldConfigsFor(
                'programNotificationTemplate',
                ['name', 'messageTemplate'],
            ),
        )(class extends Component {
            componentDidMount() {
                // FIXME: Hack to reposition the dialog when the first step is clicked (https://github.com/callemall/material-ui/issues/5793)
                setTimeout(() => window.dispatchEvent(new Event('resize')), 600);
            }

            render() {
                const { fieldConfigs = [], onUpdateField } = this.props;

                return (
                    <FormBuilder
                        fields={fieldConfigs}
                        onUpdateField={onUpdateField}
                    />
                );
            }
        }),
    },
    {
        key: 'when',
        name: 'when_to_send_it',
        content:
            compose(
                connect(mapStateToProps, _mapDispatchToProps, undefined, { pure: false }),
                createFieldConfigsFor(
                    'programNotificationTemplate',
                    ['notificationTrigger', 'relativeScheduledDays'],
                    skipLogicForNotificationTrigger
                ),
            )(({ fieldConfigs = [], onUpdateField }) => (
                <FormBuilder
                    fields={fieldConfigs}
                    onUpdateField={onUpdateField}
                />
                )),
    },
    {
        key: 'who',
        name: 'who_to_send_it_to',
        content:
            compose(
                connect(mapStateToProps, _mapDispatchToProps, undefined, { pure: false }),
                createFieldConfigsFor(
                    'programNotificationTemplate',
                    ['notificationRecipient', 'recipientUserGroup', 'deliveryChannels'],
                    skipLogicForRecipients
                )
            )(({ fieldConfigs = [], onUpdateField }) => (
                <FormBuilder
                    fields={fieldConfigs}
                    onUpdateField={onUpdateField}
                />
                )),
    },
];

const Stepper = compose(
    withState('activeStep', 'setActiveStep', 0),
    withProps(({ setActiveStep }) => ({
        stepperClicked(stepKey) {
            setActiveStep(steps.findIndex(step => step.key === stepKey));
        },
    })),
)(createStepperFromConfig(steps, 'vertical'));

const notificationDialogStyle = {
    content: {
        width: '60%',
        minWidth: 700,
        maxWidth: 'none',
    },
};

function NotificationDialog({ model, onCancel, onConfirm }, { d2 }) {
    const t = d2.i18n.getTranslation.bind(d2.i18n);
    const actions = [
        <FlatButton
            label={t('cancel')}
            primary
            onTouchTap={onCancel}
        />,
        <FlatButton
            label={t('save')}
            primary
            onTouchTap={() => onConfirm(model)}
        />,
    ];

    return (
        <Dialog
            actions={actions}
            open={!!model}
            onRequestClose={onCancel}
            title={`${t('program_notification')} (${model.displayName || ''})`}
            autoDetectWindowHeight
            autoScrollBodyContent
            contentStyle={notificationDialogStyle.content}
        >
            <Stepper />
        </Dialog>
    );
}
NotificationDialog.contextTypes = {
    d2: PropTypes.object,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    onCancel: setEditModel.bind(null, null),
    onConfirm: saveStageNotification,
}, dispatch);

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch(({ model }) => !model, renderNothing)
)(NotificationDialog);
