import React from 'react';
import Snackbar from 'material-ui/lib/snackbar';
import snackStore from './snack.store';
import ObserverRegistry from '../utils/ObserverRegistry.mixin';
import log from 'loglevel';

const SnackBarContainer = React.createClass({
    mixins: [ObserverRegistry],

    getInitialState() {
        return {};
    },

    componentWillMount() {
        const snackStoreDisposable = snackStore.subscribe(snack => {
            if (snack) {
                this.setState({
                    snack: snack,
                }, () => {
                    this.refs.snackbar.show();
                });
            } else {
                this.refs.snackbar.dismiss();
            }
        }, log.info.bind(log));

        this.registerDisposable(snackStoreDisposable);
    },

    render() {
        if (!this.state.snack) {
            return null;
        }

        return (
            <Snackbar
                ref="snackbar"
                message={this.state.snack.message}
                action={this.state.snack.action}
                autoHideDuration={0}
                openOnMount={false}
                onActionTouchTap={this.state.snack.onActionTouchTap}
            />
        );
    },
});

export default SnackBarContainer;
