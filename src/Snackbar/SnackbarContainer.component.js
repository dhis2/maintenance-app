import React from 'react'

import { Component } from 'react';
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

    UNSAFE_componentWillMount() {
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

    closeSnackbar = () => this.setState({ show: false });

    registerDisposable = (disposable) => {
        this.observerDisposables.push(disposable);
    }

    render() {
        if (!this.state.snack) {
            return null;
        }
        //Span wrapper for styling, to work with multiline messages
        const actionLabel = <span style={{position: 'relative', top: '-3px'}}>{this.state.snack.action}</span>
        const message =
            typeof this.state.snack.message === 'string'
                ? this.state.snack.message
                : this.state.snack.message.toString()
        return (
            <Snackbar
                style={{ maxWidth: 'auto', height: 'auto', zIndex: 5 }}
                bodyStyle={{ maxWidth: 'auto', height:'auto', 'lineHeight': '24px', minHeight: '48px', padding: '10px 24px'}}
                contentStyle={{ display: 'flex', alignItems: 'center', height: '100%'}}
                ref="snackbar"
                message={message}
                action={actionLabel}
                autoHideDuration={0}
                open={this.state.show}
                onClick={this.state.snack.onClick}
                onRequestClose={this.closeSnackbar}
            />
        );
    }
}

export default SnackBarContainer;
