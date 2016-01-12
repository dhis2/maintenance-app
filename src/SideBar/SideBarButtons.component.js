import React from 'react';

import {Navigation} from 'react-router';

import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import IconButton from 'material-ui/lib/icon-button';

export default React.createClass({
    mixins: [Translate, Navigation],

    render() {
        return (
            <div>
                <IconButton
                    iconClassName="material-icons"
                    tooltip={this.getTranslation('metadata_management_overview')}
                    tooltipPosition="bottom-right"
                    onClick={this._gotoOverview}>
                    &#xE8F0;
                </IconButton>
                <IconButton
                    iconClassName="material-icons"
                    tooltip={this.getTranslation('metadata_group_editor')}
                    tooltipPosition="bottom-right"
                    onClick={this._goToGroupEditor}>
                    &#xE428;
                </IconButton>
            </div>
        );
    },

    _gotoOverview() {
        this.transitionTo('/');
    },

    _goToGroupEditor() {
        this.transitionTo('groupEditor');
    },
});
