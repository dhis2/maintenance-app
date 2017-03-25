import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { createStepperFromConfig } from '../stepper';
import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import { modelToEditSelector } from './selectors';
import { setEditModel } from './actions';
import { bindActionCreators } from 'redux';
import { get } from 'lodash/fp';
import { createFieldConfigForModelTypes } from '../../formHelpers';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import mapPropsStream from 'recompose/mapPropsStream';
import { Observable } from 'rxjs';

import TextField from 'material-ui/TextField';

const mapStateToProps = (state) => ({
    model: modelToEditSelector(state),
});


const steps = [
    {
        key: 'what',
        name: 'what',
        content: connect(mapStateToProps)(({ model = {} }) => (
            <TextField
                name="name"
                floatingLabelText={'name'}
                value={get('name', model) || ''}
            />
        )),
    },
    {
        key: 'when',
        name: 'when',
        content: () => (<div>When</div>),
    },
    {
        key: 'who',
        name: 'who',
        content:
            compose(
                connect(mapStateToProps, undefined, undefined, { pure: false }),
                mapPropsStream(props$ => props$
                    .combineLatest(
                        Observable.fromPromise(createFieldConfigForModelTypes('programNotificationTemplate', ['notificationRecipient', 'recipientUserGroup', 'deliveryChannels'])),
                        (props, fieldConfigs) => ({ ...props, fieldConfigs: fieldConfigs
                            .map(fieldConfig => {
                                console.log(fieldConfig.name, props.model[fieldConfig.name]);
                                return ({ ...fieldConfig, value: props.model[fieldConfig.name] })
                            })
                        })
                    )
                )
            )(({ model = {}, fieldConfigs = [] }) => {
                console.log(fieldConfigs);
                return (
                    <FormBuilder fields={fieldConfigs} onUpdateField={(...args) => { console.log(args) }} />
                );
            }),
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

function NotificationDialog({ model, open, onCancel, onConfirm }) {
    console.log(open, onCancel);

    const t = (v) => v;
    const actions = [
        <FlatButton
            label={t('cancel')}
            primary
            onTouchTap={onCancel}
        />,
        <FlatButton
            label={t('save')}
            primary
            onTouchTap={onConfirm}
        />,
    ];

    return (
        <Dialog
            actions={actions}
            open={!!model}
            onRequestClose={onCancel}
        >
            <div>
                <Stepper />
            </div>
        </Dialog>
    )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onCancel: setEditModel.bind(null, null),
    onConfirm: setEditModel.bind(null, null),
}, dispatch);

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(NotificationDialog);
