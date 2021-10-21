import ReactCreateClass from 'create-react-class'
import PropTypes from 'prop-types'

import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';

export default ReactCreateClass({
    propTypes: {
        itemListStore: PropTypes.object.isRequired,
        onItemSelected: PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            items: [],
        };
    },

    UNSAFE_componentWillMount() {
        this.subscription = this.props.itemListStore
            .map(modelList => modelList
                    .map(model => ({
                        text: model.displayName,
                        payload: model.id,
                        model,
                    })))
            .subscribe((items) => {
                if (items.length) {
                    this.props.onItemSelected(items[0].model);
                }

                this.setState({ items });
            });
    },

    componentWillUnmount() {
        if (this.subscription && this.subscription.unsubscribe) {
            this.subscription.unsubscribe();
        }
    },

    renderOptions() {
        return this.state.items
            .map((option, index) => <MenuItem key={index} primaryText={option.text} value={option.payload} />);
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
