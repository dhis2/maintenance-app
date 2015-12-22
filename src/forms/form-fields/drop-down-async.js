import React from 'react';
import DropDown from './drop-down';
import {getInstance} from 'd2/lib/d2';

export default React.createClass({
    propTypes: {
        referenceType: React.PropTypes.string.isRequired,
        defaultValue: React.PropTypes.shape({
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
            .then(d2 => d2.models[this.props.referenceType].list({fields: 'id,displayName', paging: false}))
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
                });
                this.forceUpdate();
            });
    },

    render() {
        return (
            <DropDown {...this.props} options={this.state.options} defaultValue={this.props.defaultValue ? this.props.defaultValue.id : undefined} onChange={this._onChange} />
        );
    },

    _onChange(event) {
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
