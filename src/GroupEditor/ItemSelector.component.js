import React from 'react';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default React.createClass({
    propTypes: {
        itemListStore: React.PropTypes.object.isRequired,
        onItemSelected: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            items: [],
        };
    },

    componentWillMount() {
        this.disposable = this.props.itemListStore
            .map(modelList => {
                return modelList
                    .map(model => {
                        return {
                            text: model.displayName,
                            payload: model.id,
                            model,
                        };
                    });
            })
            .subscribe(items => {
                if (items.length) {
                    this.props.onItemSelected(items[0].model);
                }

                this.setState({ items });
            });
    },

    componentWillUnmount() {
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    },

    renderOptions() {
        return this.state.items
            .map((option, index) => {
                return <MenuItem key={index} primaryText={option.text} value={option.payload} />
            });
    },

    render() {
        return (
            <div>
                <SelectField onChange={this._onChange} value={this.props.value && this.props.value.id} fullWidth>{this.renderOptions()}</SelectField>
            </div>
        );
    },

    _onChange(event, index, value) {
        if (this.state.items && this.state.items[index]) {
            this.props.onItemSelected(this.state.items[index].model);
        }
    },
});
