import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import CircularProgress from 'material-ui/CircularProgress';

import { getInstance as getD2 } from 'd2/lib/d2';

import snackActions from '../../Snackbar/snack.actions';
import predictorDialogStore from './predictorDialogStore';

const styles = {
    flatButtonStyle: {
        marginRight: 16,
    },
    progressBarStyle: {
        progress: {
            marginTop: 32,
            marginRight: 64,
            textAlign: 'center',
        },
        title: {
            textAlign: 'center',
            marginRight: 64,
        },
    },
    dialogStyle: {
        body: {
            marginLeft: 64,
        },
        content: {
            maxWidth: 450,
        },
        margin: {
            marginBottom: 16,
        },
    },
};

class PredictorDialog extends Component {
    state = {
        open: false,
        running: false,
    };

    componentDidMount() {
        this.subscriptions = [];
        this.subscriptions.push(predictorDialogStore.subscribe(state => this.setState(state)));
    }

    componentWillUnmount() {
        this.subscriptions.forEach(disposable => disposable.unsubscribe && disposable.unsubscribe());
    }

    getTranslation = key => this.context.d2.i18n.getTranslation(key);

    setStartDate = (e, value) => {
        const d = new Date(value);
        this.setState({ startDate: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` });
    }

    setEndDate = (e, value) => {
        const d = new Date(value);
        this.setState({ endDate: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` });
    }

    setCloseAndStop = () => this.setState({
        open: false,
        running: false,
    });

    requestClose = () => {
        predictorDialogStore.setState(Object.assign({},
            predictorDialogStore.state,
            { open: false }),
        );
    }

    showMessageWithOk = message => snackActions.show({
        message,
        action: 'ok',
    });

    executeAction = async () => {
        const d2 = await getD2();
        const href = [this.state.model.modelDefinition.plural, this.state.model.id, 'run'].join('/');
        const targetUrl = `${href}?startDate=${this.state.startDate}&endDate=${this.state.endDate}`;

        this.setState({ running: true });

        d2.Api.getApi()
            .post(targetUrl, { startDate: this.state.startDate, endDate: this.state.endDate })
            .then((res) => {
                this.showMessageWithOk(res.message);
                this.setCloseAndStop();
            })
            .catch((err) => {
                const message = `${this.getTranslation('failed_to_start_predictor')}: ${err.message}`;
                this.showMessageWithOk(message);
                this.setCloseAndStop();
                console.error(err);
            });
    }

    render() {
        const actions = [
            <FlatButton
                label={this.getTranslation('cancel')}
                onClick={this.requestClose}
                style={styles.flatButtonStyle}
                disabled={this.state.running}
            />,
            <RaisedButton
                label={this.getTranslation('run_predictor')}
                primary
                onClick={this.executeAction}
                disabled={!this.state.startDate || !this.state.endDate || this.state.running}
            />,
        ];

        const DatePickers = (
            <div>
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
            </div>
        );

        const ProgressBar = (
            <div>
                <div style={styles.progressBarStyle.title}>
                    {this.getTranslation('running_predictor')}
                </div>
                <div style={styles.progressBarStyle.progress}>
                    <CircularProgress />
                </div>
            </div>
        );

        return (
            <Dialog
                open={this.state.open}
                actions={actions}
                title={this.getTranslation('run_predictor')}
                contentStyle={styles.dialogStyle.content}
                bodyStyle={styles.dialogStyle.body}
            >
                {this.state.running
                    ? ProgressBar
                    : DatePickers}
                <div style={styles.dialogStyle.margin} />
            </Dialog>
        );
    }
}
PredictorDialog.contextTypes = { d2: React.PropTypes.any };

export default PredictorDialog;
