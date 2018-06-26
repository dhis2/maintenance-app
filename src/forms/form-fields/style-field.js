/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FieldWrapper from './helpers/FieldWrapper';
import IconPickerDialog from './helpers/IconPickerDialog';
import ColorPicker from './helpers/ColorPicker';

const modelsWithColor = new Set(['option']);
const modelsWithIcons = new Set(['option']);

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
        const { name: modelName } = this.props.modelDefinition;
        const showColorPicker = modelsWithColor.has(modelName);
        const showIconPicker = modelsWithIcons.has(modelName);
        return (
            <div>
                { showColorPicker &&
                    <FieldWrapper
                        key="colorpicker"
                        label="Color"
                    >
                        <ColorPicker
                            updateStyleState={this.updateStyleState}
                            color={this.state.style.color}
                            modelName={modelName}
                        />
                    </FieldWrapper>
                }
                { showIconPicker &&
                    <FieldWrapper
                        key="iconpicker"
                        label="Icon"
                    >
                        <IconPickerDialog />
                    </FieldWrapper>
                }
            </div>
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
