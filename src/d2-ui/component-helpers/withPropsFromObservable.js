import React, { Component } from 'react';
import log from 'loglevel';
import getDisplayName from 'recompose/getDisplayName';
import CircularProgress from '../circular-progress/CircularProgress';

export default function withPropsFromObservable(observable, BaseComponent) {
    class WithPropsFromComponent extends Component {
        constructor(props, context) {
            super(props, context);

            this.state = {
                isLoading: true,
            };
        }

        componentDidMount() {
            this.disposable = observable
                .subscribe(
                    props => this.setState({ isLoading: false, ...props }),
                    (error) => { log.error(`Failed to receive props for ${BaseComponent.displayName}`); log.error(error); },
                );
        }

        componentWillUnmount() {
            if (this.disposable && this.disposable.unsubscribe) {
                this.disposable.unsubscribe();
            }
        }

        render() {
            const { isLoading, ...componentProps } = this.state;

            if (this.state.isLoading) {
                return (
                    <CircularProgress />
                );
            }

            return (
                <BaseComponent {...componentProps} {...this.props} />
            );
        }
    }

    WithPropsFromComponent.displayName = `withPropsFrom(${getDisplayName(BaseComponent)})`;

    return WithPropsFromComponent;
}
