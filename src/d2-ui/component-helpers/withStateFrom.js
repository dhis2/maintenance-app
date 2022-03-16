import React, { Component } from 'react';
import log from 'loglevel';

export default function withStateFrom(stateSource$, BaseComponent) {
    const withStateForm = class extends Component {
        componentDidMount() {
            this.disposable = stateSource$
                .subscribe(
                    state => this.setState(state),
                    error => log.error(error),
                );
        }

        componentWillUnmount() {
            this.disposable && this.disposable.unsubscribe && this.disposable.unsubscribe();
        }

        render() {
            return (
                <BaseComponent {...this.state} {...this.props} />
            );
        }
    };

    withStateForm.displayName = BaseComponent.displayName || BaseComponent.name;

    return withStateForm;
}
