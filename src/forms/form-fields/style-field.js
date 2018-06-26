/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FieldWrapper from './helpers/FieldWrapper';
import ColorPicker from './helpers/ColorPicker';

export default class StyleFields extends Component {
    constructor(props, context) {
        super(props, context);

        const style = {
            color: '',
            icon: '',
        };

        const orgStyle = props.value;

        this.state = {
            style: {
                // model style
                ...style,
                ...orgStyle,
            },
        };
    }

    updateStyleState = (newStyleProp) => {
        const style = {
            ...this.state.style,
            ...newStyleProp,
        };

        this.setState({ style });

        this.props.onChange({
            target: {
                value: style,
            },
        });
    };

    render() {
        return (
            <FieldWrapper label="Color">
                <ColorPicker
                    updateStyleState={this.updateStyleState}
                    color={this.state.style.color}
                    modelDefinition={this.props.modelDefinition}
                />
            </FieldWrapper>
        );
    }
}

StyleFields.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    modelDefinition: PropTypes.object.isRequired,
};

StyleFields.defaultProps = {
    value: null,
};

StyleFields.contextTypes = {
    d2: PropTypes.object,
};
