import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDownAsyncGetter from '../../../forms/form-fields/drop-down-async-getter';

class LocaleDropDown extends Component {
    constructor(props, context) {
        super(props, context);
        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    }

    render() {
        const { value, labelKey, ...rest } = this.props;
        const extendedProps = {
            ...rest,
            value: value && value.id ? value.id : value,
            labelText: `${this.getTranslation(labelKey)} *`,
            useFullOptionAsValue: true,
            useValueDotId: false,
        };

        return <DropDownAsyncGetter {...extendedProps} />;
    }
}

LocaleDropDown.propTypes = {
    style: PropTypes.object,
    model: PropTypes.shape({
        notificationRecipient: PropTypes.string,
    }),
    value: PropTypes.object,
    labelKey: PropTypes.string.isRequired,
    getter: PropTypes.func.isRequired,
};

LocaleDropDown.defaultProps = {
    style: {},
    model: null,
    value: null,
};

LocaleDropDown.contextTypes = {
    d2: PropTypes.object,
};

export default LocaleDropDown;
