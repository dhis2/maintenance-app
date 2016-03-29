import React from 'react';
import DropDown from './drop-down';
import { getInstance } from 'd2/lib/d2';

export default React.createClass({
    propTypes: {
        referenceType: React.PropTypes.string.isRequired,
        value: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
        }).isRequired,
        onChange: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            options: [],
        };
    },

    componentDidMount() {
        getInstance()
            .then(d2 => d2.models[this.props.referenceType].list({ fields: 'id,displayName,name', paging: false, filter: this.props.queryParamFilter }))
            .then(modelCollection => modelCollection.toArray())
            .then(values => values.map(model => {
                return {
                    text: model.displayName,
                    value: model.id,
                    model: model,
                };
            }))
            .then(options => {
                this.setState({
                    options: options,
                }, () => {
                    // TODO: Hack to default categoryCombo to 'default'
                    const defaultOption = this.state.options.find(option => {
                        return option.model.name === 'default';
                    });

                    if (!this.props.value && defaultOption) {
                        this.props.onChange({
                            target: {
                                value: defaultOption.model,
                            },
                        });
                    }

                    this.forceUpdate();
                });
            });
    },

    render() {
        let defaultValue = {};

        return (
            <DropDown {...this.props} options={this.state.options} value={this.props.value ? this.props.value.id : defaultValue.id} onChange={this._onChange} />
        );
    },

    _onChange(event) {
        if (event.target.value === null) {
            this.props.onChange({
                target: {
                    value: null,
                },
            });
            return;
        }

        const option = this.state.options.find((opt) => opt.model.id === event.target.value);
        if (option && option.model) {
            this.props.onChange({
                target: {
                    value: option.model,
                },
            });
        }
    },
});
