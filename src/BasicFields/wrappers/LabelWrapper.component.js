import React from 'react';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import classes from 'classnames';

const noop = () => {};

// TODO: Wrapper mixin can be exported to make it easier to create wrapper components
const WrapperMixin = React.createMixin({
    propTypes: {
        formName: React.PropTypes.string.isRequired,
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
            templateOptions: React.PropTypes.shape({
                label: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                    React.PropTypes.number,
                ]),
            }).isRequired,
        }).isRequired,
        children: React.PropTypes.node,
    },

    getDefaultProps() {
        return {
            fieldConfig: {
                templateOptions: {},
            },
            model: {},
            contentUpdated: noop,
        };
    },

    componentWillMount() {
        // Create a shortcut for the template options
        this.to = this.props.fieldConfig.templateOptions;
        this.fc = this.props.fieldConfig;
    },

    inputGotFocus() {
        this.setState({
            hasFocus: true,
        });
    },

    inputLostFocus() {
        this.setState({
            hasFocus: false,
        });
    },

    contentUpdated(hasContent) {
        this.setState({
            hasContent: hasContent,
        }, this.props.contentUpdated);
    },
});

const LabelWrapper = React.createClass({
    propTypes: {
        formName: React.PropTypes.string.isRequired,
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
            templateOptions: React.PropTypes.shape({
                label: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                    React.PropTypes.number,
                ]),
            }).isRequired,
        }).isRequired,
        children: React.PropTypes.node,
        model: React.PropTypes.object.isRequired,
        validationClasses: React.PropTypes.arrayOf(React.PropTypes.string),
    },

    contextTypes: {
        updateForm: React.PropTypes.func.isRequired,
    },

    childContextTypes: {
        updateForm: React.PropTypes.func.isRequired,
    },

    mixins: [WrapperMixin, Translate],

    getChildContext() {
        return {
            updateForm: this.context.updateForm,
        };
    },

    getInitialState() {
        return {
            hasFocus: false,
        };
    },

    getId() {
        return [this.props.formName, this.props.fieldConfig.key].filter(part => part).join('__');
    },

    getValue() {
        if (!this.props.fieldConfig.key || !this.props.model) { return undefined; }

        const keyParts = this.props.fieldConfig.key.split('.');
        let value = this.props.model;

        while (keyParts.length > 0) {
            value = value[keyParts.shift()];
        }

        return value;
    },

    render() {
        const classList = classes(
            'd2-input',
            'input-field',
            {
                'd2-input--focused': this.state.hasFocus,
                'd2-input--content': (this.state.hasContent || this.getValue()) ? true : false,
            },
            this.props.validationClasses
        );

        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                whenFocusReceived: this.inputGotFocus,
                whenFocusLost: this.inputLostFocus,
                contentUpdated: this.contentUpdated});
        });

        const labelClasses = classes({
            active: Boolean(this.state.hasContent || this.getValue()),
        });

        // TODO: Duplicate code with Input.component
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
            <div className={classList}>
                <label className={labelClasses} htmlFor={this.getId()}>{getLabelText()}</label>
                {children}
            </div>
        );
    },
});

export default LabelWrapper;
