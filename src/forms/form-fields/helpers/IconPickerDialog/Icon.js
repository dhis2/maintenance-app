import { Component, createRef } from 'react';
import PropTypes from 'prop-types';

export default class Icon extends Component {
    constructor(props) {
        super(props);
        this.img = createRef();
    }

    componentDidMount() {
        const img = this.img.current

        if (img?.current) {
            img.onload = this.handleLoad;
        }
    }

    handleLoad = () => {
        this.img.current.removeAttribute('data-loading');
    }

    handleClick = () => {
        this.props.handleClick(this.props.icon.key);
    }

    render() {
        const { icon: { href, key, description }, selectedIconKey } = this.props;
        const classSuffix = key === selectedIconKey ? ' icon-picker__icon--selected' : '';
        const title = description || key.replace(/_/g, ' ');
        /* eslint-disable */
        return (
            <img
                ref={this.img}
                src={href}
                alt={title}
                title={title}
                data-loading
                className={`icon-picker__icon${classSuffix}`}
                onClick={this.handleClick}
                onLoad={this.handleLoad}
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
