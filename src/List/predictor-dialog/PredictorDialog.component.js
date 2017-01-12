import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';

import { getInstance as getD2 } from 'd2/lib/d2';

import snackActions from '../../Snackbar/snack.actions';
import predictorDialogStore from './predictorDialogStore';

class PredictorDialog extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            open: false,
        };

        this.getTranslation = this.context.d2.i18n.getTranslation.bind(this.context.d2.i18n);

        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.executeAction = this.executeAction.bind(this);
    }

    componentDidMount() {
        this.disposables = [];
        this.disposables.push(predictorDialogStore.subscribe(state => this.setState(state)));
    }

    componentWillUnmount() {
        this.disposables.forEach(disposable => disposable.dispose && disposable.dispose());
    }

    requestClose() {
        predictorDialogStore.setState(Object.assign({}, predictorDialogStore.state, { open: false }));
    }

    setStartDate(e, value) {
        const d = new Date(value);
        this.setState({ startDate: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}` });
    }

    setEndDate(e, value) {
        const d = new Date(value);
        this.setState({ endDate: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}` });
    }

    async executeAction() {
        const d2 = await getD2();
        const href = [this.state.model.modelDefinition.plural, this.state.model.id, 'run'].join('/');
        const targetUrl = `${href}?startDate=${this.state.startDate}&endDate=${this.state.endDate}`;

        snackActions.show({ message: this.getTranslation('predictor_started') });
        this.setState({ open: false });

        d2.Api.getApi().post(targetUrl, { startDate: this.state.startDate, endDate: this.state.endDate })
            .catch(err => {
                snackActions.show({ message: `${this.getTranslation('failed_to_start_predictor')}: ${err.message}`, action: 'ok' });
                console.error(err);
            });
    }

    render() {
        const actions = [
            <FlatButton
                label={this.getTranslation('cancel')}
                onClick={this.requestClose}
                style={{ marginRight: 16 }}
            />,
            <RaisedButton
                label={this.getTranslation('run_predictor')}
                primary
                onClick={this.executeAction}
                disabled={!this.state.startDate || !this.state.endDate}
            />
        ];

        return (
            <Dialog
                open={this.state.open}
                actions={actions}
                title={this.getTranslation('select_date_range')}
                contentStyle={{ maxWidth: 450 }}
                bodyStyle={{ marginLeft: 64 }}
            >
                <DatePicker
                    autoOk
                    floatingLabelText={`${this.getTranslation('start_date')} (*)`}
                    onChange={this.setStartDate}
                />
                <DatePicker
                    autoOk
                    floatingLabelText={`${this.getTranslation('end_date')} (*)`}
                    onChange={this.setEndDate}
                />
                <div style={{ marginBottom: 16 }} />
            </Dialog>
        );
    }
}
PredictorDialog.contextTypes = { d2: React.PropTypes.any };

export default PredictorDialog;
