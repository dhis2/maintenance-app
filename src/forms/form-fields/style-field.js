/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'd2-ui/lib/button/Button';
import LoadableComponent from '../../utils/LoadableComponent';
import ColorPickerField from './color-picker';

const LoadablePicker = LoadableComponent({
    loader: () => import('react-color/lib/components/twitter/Twitter'),
});

const styles = {
    wrapper: {
        position: 'relative',
        overflow: 'visible',
    },
    cover: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    picker: {
        position: 'absolute',
        zIndex: '100',
        // top: -207,
        // left: 120,
    },
};

function isColorDark(color) {
    if (!color) return false;
    const hex = color.substring(1);
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const avg = (r + g + b) / 3;
    return avg < 140;
}

export default class StyleFields extends Component {
    constructor(props, context) {
        super(props, context);

        const style = {
            color: '',
            icon: '',
        };

        const orgStyle = props.model.style;

        this.state = {
            style: {
                //model style
                ...style,
                ...orgStyle,
            },
            colorOpen: false,
        };
    }

    handleOpenColor = () => {
        this.setState({ ...this.state, colorOpen: !this.state.colorOpen });
    };

    handleCloseColor = () => {
        this.setState({ ...this.state, colorOpen: false });
    };

    updateStyleState = newStyle => {
        this.setState({
            ...this.state,
            style: {
                ...this.state.style,
                ...newStyle,
            },
        });
    };

    handleColorChange = val => {
        const color = val.hex;

        const style = {
            ...this.state.style,
            color,
        };

        this.updateStyleState(style);

        this.props.onChange({
            target: {
                value: style,
            },
        });
    };

    renderColorPicker = () => {
        const { color } = this.state.style;
        const isDark = isColorDark(color);

        const mergedStyles = {
            ...styles,
            color: {
                backgroundColor: color || '#fffff',
                color: isDark ? '#fff' : '#000',
                textAlign: 'center',
                position: 'relative',
                width: 90,
                height: 36,
                lineHeight: 2.5,
                marginTop: 10,
                boxShadow:
                    '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
                cursor: 'pointer',
            },
        };

        return (
            <div style={mergedStyles.wrapper}>
                <Button
                    style={mergedStyles.color}
                    onClick={this.handleOpenColor}
                >
                    {this.state.style.color ||
                        this.context.d2.i18n.getTranslation('none')}
                </Button>
                {this.state.colorOpen && (
                    <div>
                        <div
                            style={styles.cover}
                            onClick={this.handleCloseColor}
                        />
                        <div style={mergedStyles.picker}>
                            <LoadablePicker
                                color={this.state.style.color}
                                onChangeComplete={this.handleColorChange}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    render() {
        return <ColorPickerField>{this.renderColorPicker()}</ColorPickerField>;
    }
}

StyleFields.contextTypes = {
    d2: PropTypes.object,
};
