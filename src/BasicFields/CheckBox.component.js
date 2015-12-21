import React from 'react';
import FormFieldMixin from './FormField.mixin';
import CheckBox from 'material-ui/lib/checkbox';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

export default React.createClass({
    propTypes: {
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string,
        }).isRequired,
        model: React.PropTypes.object.isRequired,
    },

    mixins: [FormFieldMixin, Translate],

    render() {
        const fc = this.props.fieldConfig;
        const to = fc.templateOptions || {};
        const getLabelText = () => {
            return this.getTranslation(to.label || fc.key);
        };

        return (
            <div className="check-box">
                <CheckBox id={fc.key}
                          defaultChecked={this.props.model[fc.key]}
                          onClick={this.toggleCheckBox}
                          label={getLabelText()}
                />
            </div>
        );
    },

    toggleCheckBox() {
        const fc = this.props.fieldConfig;

        this.handleChange({target: {value: !this.props.model[fc.key]}});
    },
});
