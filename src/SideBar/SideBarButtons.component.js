import React from 'react';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import IconButton from 'material-ui/lib/icon-button';
import {goToRoute} from '../router';

export default React.createClass({
    mixins: [Translate],

    _gotoOverview() {
        goToRoute('/');
    },

    _goToGroupEditor() {
        goToRoute('/group-editor');
    },

    render() {
        return (
            <div style={{paddingLeft: '.75rem'}}>
                <IconButton
                    iconClassName="material-icons"
                    tooltip={this.getTranslation('metadata_management_overview')}
                    tooltipPosition="bottom-right"
                    onClick={this._gotoOverview}
                >
                    &#xE8F0;
                </IconButton>
                <IconButton
                    iconClassName="material-icons"
                    tooltip={this.getTranslation('metadata_group_editor')}
                    tooltipPosition="bottom-right"
                    onClick={this._goToGroupEditor}
                >
                    &#xE428;
                </IconButton>
            </div>
        );
    },
});
