import React, { Component, PropTypes } from 'react';
import DropDown from '../../../forms/form-fields/drop-down.js';
import { red500, grey400 } from 'material-ui/styles/colors';
import { LinearProgress } from 'material-ui';

const DropDownLoader = ({ msg }) => (
    <p
        style={{
            color: grey400,
            fontSize: 16,
            fontWeight: 300,
            padding: '41px 0 6px',
            margin: 0,
        }}
    >
        {msg}
        <LinearProgress style={{ marginTop: 4, height: 2 }} />
    </p>
);

class DataElementCategoryOptionCombo extends Component {
    state = {
        options: [],
        loading: false,
        loadErrorText: '',
        defaultCategoryOptionComboId: null
    };
    getTranslation = this.context.d2.i18n.getTranslation.bind(
        this.context.d2.i18n
    );

    // The form builder is mutating objects which causes this.props.model.output
    // and prevProps.model.output to be equal in the componentDidUpdate hook,
    // after the output property was updated.
    // By keeping track of this string literal the changes are detected correctly.
    prevOutputId = null;

    onChange = ({ target }) => {
        const selectedId = target.value;
        let value = selectedId ? { id: selectedId } : null;
        
        if(selectedId === this.state.defaultCategoryOptionComboId) {
            value = null
        }

        this.props.onChange({ target: { value } });
    };

    componentDidMount() {
        const currModelOutputId = this.getModelOutputId();

        if (currModelOutputId) {
            this.fetchOptions();
            this.prevOutputId = currModelOutputId;
        }
    }

    componentDidUpdate() {
        const currModelOutputId = this.getModelOutputId();

        if (currModelOutputId !== this.prevOutputId) {
            // Clear value of outputCombo when dataElement changes
            this.props.onChange({ target: { value: null } });

            if (currModelOutputId) {
                // fetch options for new dataElement (model.output.id)
                this.fetchOptions();
            }
        }

        this.prevOutputId = this.props.model.output
            ? this.props.model.output.id
            : null;
    }

    getModelOutputId() {
        const model = this.props.model;
        return model && model.output && model.output.id
            ? model.output.id
            : null;
    }

    async fetchOptions() {
        this.setState({ loading: true, loadErrorText: '' });

        try {
            const catComboResponse = this.context.d2.models.dataElements.get(
                this.props.model.output.id,
                { fields: ['categoryCombo[isDefault,categoryOptionCombos[id,name]]'] }
            );
            // need to get the default categoryCombo - to be able to show the correct label in the dropdown
            const defaultCatComboResponse = this.context.d2.models.categoryCombos.list({
                fields: ['id', 'name', 'isDefault', 'categoryOptionCombos[id,name]'],
                filter: `isDefault:eq:true`
            })
            const [response, defaultCatCombo] = await Promise.all([catComboResponse, defaultCatComboResponse])

            const defaultCategoryOptionCombo = defaultCatCombo.toArray()[0].categoryOptionCombos.toArray()[0]
            const categoryOptionCombos =
                response.categoryCombo.categoryOptionCombos;

            let options = [{ text: this.getTranslation('predict_according_to_input_category_option_combo'), value: defaultCategoryOptionCombo.id }];
            
            options = options.concat(categoryOptionCombos.map(
                o => ({
                    text: o.name,
                    value: o.id,
                })
            ));

            this.setState({ options, loading: false, defaultCategoryOptionComboId: defaultCategoryOptionCombo.id });
        } catch (error) {
            console.error(error);
            const msg = this.getTranslation('output_combo_error');
            this.setState({ loading: false, loadErrorText: msg });
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <DropDownLoader
                    msg={this.getTranslation('outpadmiut_combo_loading')}
                />
            );
        }

        if (this.state.loadErrorText) {
            return (
                <p style={{ color: red500, margin: 0 }}>
                    {this.state.loadErrorText}
                </p>
            );
        }

        if (this.state.options.length === 0) {
            return null;
        }

        const value = this.props.value && this.props.value.id || this.state.defaultCategoryOptionComboId

        return (
            <DropDown
                labelText={this.getTranslation('output_combo')}
                onChange={this.onChange}
                value={value}
                options={this.state.options}
                isRequired
            />
        );
    }
}

DataElementCategoryOptionCombo.propTypes = {
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
};

DataElementCategoryOptionCombo.defaultProps = {
    value: null,
};

DataElementCategoryOptionCombo.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default DataElementCategoryOptionCombo;
