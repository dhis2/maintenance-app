import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadableComponent from '../../utils/LoadableComponent';

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

export default class StyleFields extends Component {
    constructor(props) {
        super(props);

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
        console.log(val);
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

    render() {
        const { color } = this.state.style.color;
        const mergedStyles = {
            ...styles,
            color: {
                backgroundColor: color,
                //color: hcl(color).l < 70 ? '#fff' : '#000',
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
                <div style={mergedStyles.color} onClick={this.handleOpenColor}>
                    {this.state.style.color}
                </div>
                {this.state.colorOpen && (
                    <div is="popover">
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
    }
}
