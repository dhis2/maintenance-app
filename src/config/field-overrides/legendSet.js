import React, { Component } from 'react';
import { getInstance } from 'd2/lib/d2';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import modelToEditStore from '../../EditModel/modelToEditStore';
import log from 'loglevel';

class LegendSetErrorMessage extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
            message: ''
        };
    }

    componentDidMount() {
        this.runValidation(this.props.legends);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.legends !== this.props.legends) {
            this.runValidation(this.props.legends);
        }
    }

    // TODO: Adopted code from the GIS validation (should to be reworked to not have a for loop)
    runValidation(legends) {
        const items = legends;

        for (var i = 1; i < items.length; i++) {
            const item = items[i];
            const prevItem = items[i - 1];
            let msg;
            let title;

            if (item.startValue < prevItem.endValue) {
                title = 'Overlapping legends not allowed!';
                msg = (
                    <div>
                        <p>{prevItem.name + ' (' + prevItem.startValue + ' - ' + prevItem.endValue + ')'}</p>
                        <p>{item.name + ' (' + item.startValue + ' - ' + item.endValue + ')'}</p>
                    </div>
                );
            }

            if (prevItem.endValue < item.startValue) {
                title = 'Legend gaps detected!';
                msg = (
                    <div>
                        <p>{prevItem.name + ' (' + prevItem.startValue + ' - ' + prevItem.endValue + ')'}</p>
                        <p>{item.name + ' (' + item.startValue + ' - ' + item.endValue + ')'}</p>
                    </div>
                );
            }

            if (msg) {
                this.setState({
                    title,
                    message: msg,
                    open: true,
                });
                return
            } else {
                this.setState({
                    open: false,
                });
            }
        }
    }

    handleClose = () => {
        this.setState({
            open: false,
        });
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Discard"
                primary
                onTouchTap={this.handleClose}
            />,
        ];

        return (
            <Dialog
                actions={actions}
                open={this.state.open}
                onRequestClose={this.handleClose}
                modal
                title={this.state.title}
            >
                {this.state.message}
            </Dialog>
        );
    }
}

export default new Map([
    ['legends', {
        component: class extends React.Component {
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
                        <LegendSetErrorMessage legends={legends} />
                    </div>
                )
            }

            updateLegends = (newLegends) => {
                getInstance()
                    .then(d2 => d2.Api.getApi())
                    .then(api => api.get('system/uid', { limit: newLegends.length }))
                    .then(response => response.codes)
                    .then(codes => {
                        return newLegends.map((legend, index) => {
                            legend.id = codes[index];
                            return legend;
                        });
                    })
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
        },
    }],
]);
