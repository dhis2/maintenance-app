import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
    icon: {
        border: '3px solid transparent',
        width: 40,
        height: 40,
        cursor: 'pointer',
        margin: 4,
    },
    iconSelected: {
        border: '3px solid #64acf5',
    },
};

export default class Icon extends Component {
    handleClick = () => {
        this.props.handleClick(this.props.icon.key);
    }

    render() {
        const { icon: { href, key, description }, selectedIconKey } = this.props;
        /* eslint-disable */
        return (
            <img
                src={href}
                alt={description || key}
                style={
                    key === selectedIconKey ?
                        { ...styles.icon, ...styles.iconSelected } :
                        styles.icon
                }
                onClick={this.handleClick}
            />
        );
        /* eslint-enable */
    }
}

Icon.propTypes = {
    icon: PropTypes.object.isRequired,
    selectedIconKey: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
};
