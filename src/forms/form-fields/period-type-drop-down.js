import React from 'react';
import DropDown from './drop-down';
import periodTypeStore from '../../App/periodTypeStore';

class PeriodTypeDropDown extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            options: [],
        };
    }

    componentWillMount() {
        this.sub = periodTypeStore.subscribe((periodTypes) => {
            this.setState({ options: periodTypes });
        });
    }

    componentWillUnmount() {
        this.sub && this.sub.unsubscribe && this.sub.unsubscribe();
    }

    render() {
        return <DropDown {...this.props} options={this.state.options} />;
    }
}

export default PeriodTypeDropDown;
