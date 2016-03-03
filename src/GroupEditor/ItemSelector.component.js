import React from 'react';

import Select from 'material-ui/lib/select-field';

export default React.createClass({
    propTypes: {
        itemListStore: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
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
                            payload: model,
                        };
                    });
            })
            .subscribe(items => {
                if (items.length) {
                    // TODO: Remove hack to emit auto selected value on list change
                    this.props.onChange({
                        target: {
                            value: items[0].payload,
                        },
                    });
                }

                this.setState({ items });
            });
    },

    componentWillUnmount() {
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    },

    render() {
        return (
            <div>
                <Select {...this.props} fullWidth menuItems={this.state.items} />
            </div>
        );
    },
});
