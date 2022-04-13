import ReactCreateClass from 'create-react-class'
import PropTypes from 'prop-types'
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import { getInstance as getD2 } from 'd2';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import Translate from '@dhis2/d2-ui-translation-dialog/Translate.mixin.js';

function hasNameInArray(listToCheck) {
    return function hasNameInArrayInner(value) {
        // If no list has been given the result is always true
        if (listToCheck.length === 0) {
            return true;
        }
        return listToCheck.indexOf(value.name) !== -1;
    };
}

export default ReactCreateClass({
    propTypes: {
        nameListFilter: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func.isRequired,
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

    UNSAFE_componentWillMount() {
        getD2().then(d2 => this.setState({ models: d2.models }));
    },

    _onChange(event, index, modelType) {
        this.setState({
            selectedModel: modelType,
        });

        this.props.onChange(modelType);
    },

    renderOptions() {
        if (this.state && this.state.models) {
            return this.state.models
                .mapThroughDefinitions(v => v)
                .filter(hasNameInArray(this.props.nameListFilter))
                .map(value => ({
                    text: this.getTranslation(camelCaseToUnderscores(value.plural)),
                    payload: value,
                }))
                .map((option, index) => (
                    <MenuItem key={index} primaryText={option.text} value={option.payload} />
                    ));
        }
        return [];
    },

    render() {
        return (
            <div>
                <SelectField
                    value={this.state.selectedModel}
                    hintText={this.getTranslation('select_an_object_type')}
                    fullWidth
                    {...this.props}
                    onChange={this._onChange}
                >
                    {this.renderOptions()}
                </SelectField>
            </div>
        );
    },
});
