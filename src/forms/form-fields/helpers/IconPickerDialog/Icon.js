import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Icon extends Component {
    constructor(props) {
        super(props);
        this.img = null;

        this.setImgRef = element => {
            this.img = element;
        };
    }

    componentWillUnmount() {
        delete this.img.onload;
    }

    componentDidMount() {
        this.img.onload = () => {
            try {
                this.img.removeAttribute('data-loading');
            } catch (e) {
               // ignore, this could happen if icon are  unmounted while loading
            }
        };
    }

    handleClick = () => {
        this.props.handleClick(this.props.icon.key);
    };

    render() {
        const {
            icon: { href, key, description },
            selectedIconKey,
        } = this.props;
        const classSuffix =
            key === selectedIconKey ? ' icon-picker__icon--selected' : '';
        const title = description || key.replace(/_/g, ' ');
        /* eslint-disable */
        return (
            <img
                ref={this.setImgRef}
                src={href}
                alt={title}
                title={title}
                data-loading
                width={60}
                height={60}
                className={`icon-picker__icon${classSuffix}`}
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
