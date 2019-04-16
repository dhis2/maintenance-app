import React, { Component, PropTypes } from 'react';
import DropDown from '../../../forms/form-fields/drop-down.js';
import { red500, grey400 } from 'material-ui/styles/colors';
import { LinearProgress } from 'material-ui';

const DEFAULT = 'default';

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
    };
    getTranslation = this.context.d2.i18n.getTranslation.bind(
        this.context.d2.i18n
    );

    // The form builder is mutating objects which causes this.props.model
    // and prevProps.model to be equal in the componentDidUpdate hook.
    // By keeping track of this string literal the changes are detected correctly
    prevOutputId = null;

    onChange = event => {
        const fakeEvent = { target: { value: { id: event.target.value } } };
        this.props.onChange(fakeEvent);
    };

    componentDidMount() {
        if (this.hasModelOutputId()) {
            this.fetchOptions();
            this.prevOutputId = this.props.model.output.id;
        }
    }

    componentDidUpdate() {
        if (
            this.hasModelOutputId() &&
            this.props.model.output.id !== this.prevOutputId
        ) {
            this.fetchOptions();
        }

        this.prevOutputId = this.props.model.output
            ? this.props.model.output.id
            : null;
    }

    hasModelOutputId() {
        const model = this.props.model;
        return !!(model && model.output && model.output.id);
    }

    async fetchOptions() {
        this.setState({ loading: true, loadErrorText: '' });

        try {
            const response = await this.context.d2.models.dataElementssss.get(
                this.props.model.output.id,
                { fields: ['categoryCombo[categoryOptionCombos[id,name]]'] }
            );
            const categoryOptionCombos =
                response.categoryCombo.categoryOptionCombos;
            const hasOnlyDefault =
                categoryOptionCombos.length === 1 &&
                categoryOptionCombos[0].name === DEFAULT;
            const options = hasOnlyDefault
                ? []
                : categoryOptionCombos.map(o => ({
                      text: o.name,
                      value: o.id,
                  }));

            this.setState({ options, loading: false });
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
                    msg={this.getTranslation('output_combo_loading')}
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

        return (
            <DropDown
                labelText={this.getTranslation('output_combo')}
                onChange={this.onChange}
                value={this.props.value.id}
                options={this.state.options}
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
    value: { id: null },
};

DataElementCategoryOptionCombo.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default DataElementCategoryOptionCombo;
