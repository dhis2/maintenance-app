import React from 'react';
import classes from 'classnames';

import FormFieldMixin from './FormField.mixin.js';
import TextField from 'material-ui/lib/text-field';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

const Input = React.createClass({
    propTypes: {
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
        }).isRequired,
        model: React.PropTypes.object.isRequired,
        type: React.PropTypes.string.isRequired,
        validationClasses: React.PropTypes.array,
        isValid: React.PropTypes.bool,
    },

    mixins: [FormFieldMixin, Translate],

    componentWillMount() {
        this.validators.min = () => {
            return true;
        };
        this.validators.max = () => {
            return true;
        };
    },

    render() {
        const classList = classes(this.props.validationClasses);
        const getLabelText = () => {
            let labelText = (this.to.label || this.fc.key);
            if (this.to.translateLabel !== false) {
                labelText = this.getTranslation(labelText);
            }

            return [
                labelText,
                this.to.required ? this.getTranslation('required') : undefined,
            ].filter(value => value).join(' ');
        };

        return (
            <TextField id={this.getId()}
                       {...this.formFieldHandlers}
                       value={this.getValue()}
                       type={this.props.type}
                       className={classList}
                       floatingLabelText={getLabelText()}
                       fullWidth={true}
                       ref="inputField"
                       errorText={!this.props.isValid ? this.getTranslation('invalid') : undefined}
            />
        );
    },
});

export default Input;
