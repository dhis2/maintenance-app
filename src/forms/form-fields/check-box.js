import React from 'react';
import Checkbox from 'material-ui/lib/checkbox';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

import MuiThemeMixin from '../mui-theme.mixin';

export default React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        labelText: React.PropTypes.string.isRequired,
        value: React.PropTypes.bool,
    },

    mixins: [MuiThemeMixin, Translate],

    render() {
        return (
            <div style={{ marginTop: 12, marginBottom: 12 }}>
                <Checkbox onClick={this._onClick} {...this.props}
                          label={this.getTranslation(this.props.labelText)}
                          defaultChecked={this.props.value === true} />
            </div>
        );
    },

    _onClick() {
        // TODO: Emit a proper event..?
        this.props.onChange({
            target: {
                value: this.props.value !== true,
            },
        });
    },
});
