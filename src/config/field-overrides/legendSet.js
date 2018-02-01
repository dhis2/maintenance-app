import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from 'd2-ui/lib/messages/ErrorMessage.component';

import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import modelToEditStore from '../../EditModel/modelToEditStore';

class LegendsField extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            Legend: null,
        };
    }

    componentDidMount() {
        this.loadLegendComponent();
    }

    loadLegendComponent() {
        return System.import('d2-ui/lib/legend/Legend.component')
            .then((module) => {
                this.setState({
                    Legend: module.default,
                    isLoading: false,
                });
            });
    }

    updateLegends = (newLegends) => {
        const model = modelToEditStore.getState();
        model[this.props.referenceProperty] = newLegends;

        this.props.onChange({
            target: {
                value: model[this.props.referenceProperty],
            },
        });
    }

    render() {
        const legends = this.props.value;

        if (this.state.isLoading || !this.state.Legend) {
            return (<LinearProgress />);
        }

        return (
            <div>
                <this.state.Legend items={legends} onItemsChange={this.updateLegends} />
                <ErrorMessage message={this.props.errorText} />
            </div>
        );
    }
}

LegendsField.propTypes = {
    referenceProperty: PropTypes.string.isRequired,
    errorText: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired,
};

LegendsField.defaultProps = {
    value: [],
    errorText: '',
};


export default new Map([
    ['legends', {
        component: LegendsField,
        validators: [
            {
                message: 'overlapping_legends_not_allowed',
                validator(value) {
                    return Array.from(value.values()).every((legend, index, legends) => {
                        const nextLegend = legends[index + 1];

                        if (!nextLegend) {
                            return true;
                        }

                        return Number(nextLegend.startValue) >= Number(legend.endValue);
                    });
                },
            },
            {
                message: 'Gaps_in_the_legends_are_not_allowed',
                validator(value) {
                    return Array.from(value.values()).every((legend, index, legends) => {
                        const nextLegend = legends[index + 1];

                        if (!nextLegend) {
                            return true;
                        }

                        return Number(legend.endValue) >= Number(nextLegend.startValue);
                    });
                },
            },
        ],
    }],
]);
