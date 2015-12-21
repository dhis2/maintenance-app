import React from 'react';
import classes from 'classnames';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import FormFieldBase from './FormField.mixin.js';
import TextField from 'material-ui/lib/text-field';

const Textarea = React.createClass({
    propTypes: {
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string,
        }).isRequired,
        model: React.PropTypes.object.isRequired,
        validationClasses: React.PropTypes.array,
        isValid: React.PropTypes.bool,
    },

    mixins: [FormFieldBase, Translate],

    render() {
        const classList = classes(this.props.validationClasses, 'textarea');

        const getLabelText = () => {
            return [
                this.getTranslation(this.to.label || this.fc.key),
                this.to.required ? this.getTranslation('required') : undefined,
            ].filter(value => value).join(' ');
        };

        return (
            <TextField
                {...this.formFieldHandlers}
                value={this.getValue()}
                className={classList}
                floatingLabelText={getLabelText()}
                fullWidth={true}
                ref="inputField"
                errorText={!this.props.isValid ? 'Invalid' : undefined}
                multiLine={true}
                id={this.getId()}
            />
        );
    },
});

export default Textarea;
