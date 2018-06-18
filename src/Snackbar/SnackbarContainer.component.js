
import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import log from 'loglevel';
import snackStore from './snack.store';

class SnackBarContainer extends Component {
    state = {
        show: false,
        snack: {
            message: '',
        },
    };

    componentWillMount() {
        this.observerDisposables = [];
        const snackStoreDisposable = snackStore.subscribe((snack) => {
            if (snack) {
                this.setState({
                    snack,
                    show: true,
                });
            } else {
                this.setState({
                    show: false,
                });
            }
        }, log.debug.bind(log));

        this.registerDisposable(snackStoreDisposable);
    }

    componentWillUnmount() {
        this.observerDisposables.forEach(disposable => disposable.unsubscribe());
    }

    registerDisposable = (disposable) => {
        this.observerDisposables.push(disposable);
    }

    closeSnackbar = () => this.setState({ show: false });

    render() {
        if (!this.state.snack) {
            return null;
        }

        return (
            <Snackbar
                style={{ maxWidth: 'auto', zIndex: 5 }}
                bodyStyle={{ maxWidth: 'auto' }}
                ref="snackbar"
                message={this.state.snack.message}
                action={this.state.snack.action}
                autoHideDuration={0}
                open={this.state.show}
                onActionTouchTap={this.state.snack.onActionTouchTap}
                onRequestClose={this.closeSnackbar}
            />
        );
    }
}

export default SnackBarContainer;
