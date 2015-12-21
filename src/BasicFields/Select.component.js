import React from 'react';
import classes from 'classnames';
import {isFunction} from 'd2-utils';
import ReactSelect from 'react-select';
// import Icon from 'd2-ui-icon';

import FormFieldMixin from './FormField.mixin';

function isLoading(fieldConfig) {
    return fieldConfig.data && fieldConfig.data.loading;
}

const identity = (value) => value;

// TODO: Select when wrapped does not correctly remove the has-content class
const Select = React.createClass({
    propTypes: {
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
            templateOptions: React.PropTypes.shape({
                options: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
            }),
            data: React.PropTypes.object,
            fromModelTransformer: React.PropTypes.func,
            toModelTransformer: React.PropTypes.func,
        }).isRequired,
        contentUpdated: React.PropTypes.func.isRequired,
        model: React.PropTypes.object.isRequired,
    },

    mixins: [FormFieldMixin],

    getDefaultProps() {
        return {};
    },

    getInitialState() {
        const fc = this.props.fieldConfig;
        const options = Array.from(this.props.fieldConfig.templateOptions.options || []);

        this.reactSelectProps = {
            onChange: (value) => {
                const to = this.props.fieldConfig.templateOptions;
                // TODO: Since handle change normally receives the input event we have to simulate the synthetic event. See if there is a nicer way to do this.
                // We could change the mixin to only receive the value, however that would require most of the inputs to add a method that extracts the value.
                // An alternative resolution would be to have a second method in the mixin that takes only the value and handleChange as a proxy to that method.
                // We would then call the former.

                let selected = value;
                if (this.state.isObjectValue) {
                    selected = to.options.reduce((current, option) => option.id === value ? option : current, undefined);
                }

                this.handleChange({target: {value: this.state.toModelTransformer(selected)}});
            },
        };

        return {
            fromModelTransformer: isFunction(fc.fromModelTransformer) ? fc.fromModelTransformer : identity,
            toModelTransformer: isFunction(fc.toModelTransformer) ? fc.toModelTransformer : identity,
            isObjectValue: options.every(option => !!option.id),
            isLoading: isLoading(this.props.fieldConfig),
        };
    },

    componentWillMount() {
        if (this.hasSourcePromise()) {
            this.getSourcePromise().then(() => {
                this.setState({
                    isLoading: false,
                }, this.updateCurrentValue);
            });
        }

        this.updateCurrentValue();
    },

    componentDidMount() {
        /* eslint-disable no-underscore-dangle */
        this._hasContent = this.hasContent;
        this.hasContent = () => {
            return this._hasContent() || this.state.hasSearchContent;
        };
        /* eslint-enable no-underscore-dangle */
    },

    componentWillReceiveProps() {
        this.updateCurrentValue();
    },

    getSourcePromise() {
        return this.props.fieldConfig.data.sourcePromise;
    },

    getTransformedValue() {
        return this.state.fromModelTransformer(this.props.model);
    },

    render() {
        const classList = classes('d2-select');

        return (
            <div className={classList}>
                <ReactSelect ref="reactSelect" {...this.state.reactSelectProps} />
            </div>
        );
    },

    updateCurrentValue() {
        const to = this.props.fieldConfig.templateOptions;

        this.reactSelectProps.name = this.getId();
        this.reactSelectProps.placeholder = '';
        this.reactSelectProps.options = (to.options || []).map(option => {
            return {label: option.name, value: this.state.isObjectValue ? option.id : option.value};
        });
        this.reactSelectProps.clearable = !to.required;
        this.reactSelectProps.inputProps = {
            onKeyUp: (event) => {
                this.setState({
                    hasSearchContent: !!event.target.value,
                }, () => {
                    this.forceUpdate(() => {
                        this.props.contentUpdated(this.hasContent(), this.props.model[this.props.fieldConfig.key], this);
                    });
                });
            },
        };

        if (this.state.isObjectValue && this.getTransformedValue()) {
            if (this.getTransformedValue().id && this.getTransformedValue().name && this.props.model !== this.getTransformedValue()) {
                this.reactSelectProps.value = {label: this.getTransformedValue().name, value: this.getTransformedValue().id};
            } else {
                if (this.getValue() && this.getValue().name && this.getValue().id) {
                    this.reactSelectProps.value = {label: this.getValue().name, value: this.getValue().id};
                } else {
                    this.reactSelectProps.value = {label: this.getValue(), value: this.getValue()};
                }
            }
        } else {
            this.reactSelectProps.value = this.getValue();
        }

        this.setState({
            reactSelectProps: this.reactSelectProps,
        });
    },

    hasSourcePromise() {
        return this.props.fieldConfig.data && this.props.fieldConfig.data.sourcePromise;
    },
});

export default Select;
