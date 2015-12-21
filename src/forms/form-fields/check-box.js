import React from 'react/addons';
import Checkbox from 'material-ui/lib/checkbox';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

import MuiThemeMixin from '../mui-theme.mixin';

export default React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
    },

    mixins: [MuiThemeMixin, Translate],

    _onClick() {
        // TODO: Emit a proper event..?
        this.props.onChange({
            target: {
                value: this.props.defaultValue !== true,
            },
        })
    },

    render() {
        return (
            <div style={{marginTop: 12, marginBottom: 12}}>
                <Checkbox onClick={this._onClick} {...this.props} label={this.getTranslation(this.props.labelText)} defaultChecked={this.props.defaultValue === true}/>
            </div>
        );
    },
});
