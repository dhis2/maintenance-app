import React from 'react/addons';
import Checkbox from 'material-ui/lib/checkbox';

import MuiThemeMixin from '../mui-theme.mixin';

export default React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
    },

    mixins: [MuiThemeMixin],

    render() {
        return (
            <div style={{marginTop: 12, marginBottom: 12}}>
                <Checkbox onCheck={this.props.onChange} {...this.props}/>
            </div>
        );
    },
});
