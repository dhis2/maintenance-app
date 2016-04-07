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
        const styles = {
            buttonStyle: {
                color: '#FFF',
            },
        };

        return (
            <div>
                <IconButton
                    iconClassName="material-icons"
                    tooltip={this.getTranslation('metadata_management_overview')}
                    tooltipPosition="bottom-left"
                    onClick={this._gotoOverview}
                    iconStyle={styles.buttonStyle}
                >
                    &#xE8F0;
                </IconButton>
                <IconButton
                    iconClassName="material-icons"
                    tooltip={this.getTranslation('metadata_group_editor')}
                    tooltipPosition="bottom-left"
                    onClick={this._goToGroupEditor}
                    iconStyle={styles.buttonStyle}
                >
                    &#xE428;
                </IconButton>
            </div>
        );
    },
});
