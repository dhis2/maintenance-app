import React from 'react';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import snackStore from './snack.store';
import ObserverRegistry from '../utils/ObserverRegistry.mixin';
import log from 'loglevel';

const SnackBarContainer = React.createClass({
    mixins: [ObserverRegistry],

    getInitialState() {
        return {
            show: false,
            snack: {
                message: '',
            },
        };
    },

    componentWillMount() {
        const snackStoreDisposable = snackStore.subscribe(snack => {
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
    },

    _closeSnackbar() {
        this.setState({
            show: false,
        });
    },

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
                onRequestClose={this._closeSnackbar}
            />
        );
    },
});

export default SnackBarContainer;
