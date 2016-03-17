import React from 'react';

import Select from 'material-ui/lib/select-field';

import d2lib from 'd2/lib/d2';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

function hasNameInArray(listToCheck) {
    return function hasNameInArrayInner(value) {
        // If no list has been given the result is always true
        if (listToCheck.length === 0) {
            return true;
        }
        return listToCheck.indexOf(value.name) !== -1;
    };
}

export default React.createClass({
    propTypes: {
        nameListFilter: React.PropTypes.arrayOf(React.PropTypes.string),
        onChange: React.PropTypes.func.isRequired,
    },

    mixins: [Translate],

    getDefaultProps() {
        return {
            nameListFilter: [],
        };
    },

    getInitialState() {
        return {
            selectedModel: null,
        };
    },

    componentWillMount() {
        d2lib.getInstance()
            .then(d2 => this.setState({ models: d2.models }));
    },

    _onChange(event) {
        this.setState({
            selectedModel: event.target.value,
        });

        this.props.onChange(event);
    },

    renderOptions() {
        if (this.state && this.state.models) {
            return this.state.models
                .mapThroughDefinitions(v => v)
                .filter(hasNameInArray(this.props.nameListFilter))
                .map((value) => ({
                    text: this.getTranslation(camelCaseToUnderscores(value.plural)),
                    payload: value,
                }));
        }
        return [];
    },

    render() {
        return (
            <div>
                <Select value={this.state.selectedModel} hintText={this.getTranslation('please_select_object_type')} fullWidth {...this.props} menuItems={this.renderOptions()} onChange={this._onChange} />
            </div>
        );
    },
});
