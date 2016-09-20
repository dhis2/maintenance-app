import React, { Component } from 'react';
import { getInstance } from 'd2/lib/d2';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import modelToEditStore from '../../EditModel/modelToEditStore';
import log from 'loglevel';
import ErrorMessage from 'd2-ui/lib/messages/ErrorMessage.component';

class LegendsField extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isLoading: true,
            Legend: null,
        };
    }

    loadLegendComponent() {
        return System.import('d2-ui/lib/legend/Legend.component')
            .then(module => {
                this.setState({
                    Legend: module.default,
                    isLoading: false,
                });
            });

    }

    componentDidMount() {
        this.loadLegendComponent()
    }

    render() {
        const legends = this.props.value.toArray();

        if (this.state.isLoading || !this.state.Legend) {
            return (<LinearProgress />);
        }

        return (
            <div>
                <this.state.Legend items={legends} onItemsChange={this.updateLegends} />
                <ErrorMessage message={this.props.errorText} />
            </div>
        )
    }

    updateLegends = (newLegends) => {
        getInstance()
            .then(d2 => d2.Api.getApi())
            .then(api => api.get('system/uid', { limit: newLegends.length }))
            .then(response => response.codes)
            .then(codes => newLegends.map((legend, index) => {
                legend.id = codes[index];

                return legend;
            }))
            .then(legends => {
                const model = modelToEditStore.getState();
                model[this.props.referenceProperty].clear();

                legends.forEach(legend => model[this.props.referenceProperty].add(legend));

                this.props.onChange({
                    target: {
                        value: model[this.props.referenceProperty],
                    }
                });


            })
            .catch(log.error);
    }
}

export default new Map([
    ['legends', {
        component: LegendsField,
        validators: [
            {
                message: 'Overlapping legends not allowed!',
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
                message: 'Gaps in the legends are not allowed!',
                validator(value) {
                    return Array.from(value.values()).every((legend, index, legends) => {
                        const nextLegend = legends[index + 1];

                        if (!nextLegend) {
                            return true;
                        }

                        return Number(legend.endValue) >= Number(nextLegend.startValue);
                    });
                },
            }
        ]
    }],
]);
