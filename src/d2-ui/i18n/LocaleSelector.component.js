import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';

class LocaleSelector extends Component {
    constructor(props, context) {
        super(props, context);

        const i18n = this.context.d2.i18n;
        this.getTranslation = i18n.getTranslation.bind(i18n);
    }

    onLocaleChange = (event, index, locale) => {
        this.setState({
            locale,
        });

        this.props.onChange(locale, event);
    }

    render() {
        const localeMenuItems = [{ payload: '', text: '' }]
            .concat(this.props.locales)
            .map((locale, index) => (
                <MenuItem key={index} primaryText={locale.name} value={locale.locale} />
            ));

        return (
            <SelectField
                fullWidth
                {...this.props}
                value={this.state && this.state.locale}
                hintText={this.getTranslation('select_locale')}
                onChange={this.onLocaleChange}
            >
                {localeMenuItems}
            </SelectField>
        );
    }
}

LocaleSelector.propTypes = {
    value: PropTypes.string,
    locales: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            locale: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
};

LocaleSelector.contextTypes = {
    d2: PropTypes.object,
};

export default LocaleSelector;
