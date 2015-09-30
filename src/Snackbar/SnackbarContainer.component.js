import React from 'react';
import Snackbar from 'material-ui/lib/snackbar';
import snackStore from './snack.store';
import ObserverRegistry from '../utils/ObserverRegistry.mixin';

const SnackBarContainer = React.createClass({
    mixins: [ObserverRegistry],

    getInitialState() {
        return {};
    },

    componentWillMount() {
        const snackStoreDisposable = snackStore.subscribe(snack => {
            console.log('Show!');

            if (snack) {
                this.setState({
                    snack: snack,
                }, () => {
                    this.refs.snackbar.show();
                });
            } else {
                this.refs.snackbar.dismiss();
            }
        }, console.log.bind(console));

        this.registerDisposable(snackStoreDisposable);
    },

    render() {
        console.log(this.state.snack);
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
