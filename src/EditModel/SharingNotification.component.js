import React from 'react';
import Auth from 'd2-ui/lib/auth/Auth.mixin';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import { config } from 'd2/lib/d2';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import Paper from 'material-ui/Paper/Paper';

const SharingNotification = React.createClass({
    propTypes: {
        modelType: React.PropTypes.string,
        style: React.PropTypes.object,
    },

    mixins: [Auth, Translate],

    render() {
        const createPublic = this.getCurrentUser().canCreatePublic(this.getModelDefinitionByName(this.props.modelType));
        const createPrivate = this.getCurrentUser().canCreatePrivate(this.getModelDefinitionByName(this.props.modelType));
        const notificationStyle = Object.assign({}, this.props.style, {
            background: 'none',
            margin: '14px 0 0 -4px',
        });
        const notificationTextStyle = {
            verticalAlign: 'super',
            lineHeight: '24px',
            paddingLeft: '.5rem',
        };
        let toRender = null;

        if (createPublic) {
            toRender = (
                <Paper style={notificationStyle} zDepth={0}>
                    <FontIcon className="material-icons">lock_open</FontIcon><span style={notificationTextStyle}>{this.getTranslation('object_will_created_public')}</span>
                </Paper>
            );
        } else {
            if (createPrivate) {
                toRender = (
                    <Paper style={notificationStyle} zDepth={0}>
                        <FontIcon className="material-icons">lock</FontIcon><span style={notificationTextStyle}>{this.getTranslation('object_will_created_private')}</span>
                    </Paper>
                );
            }
        }

        return toRender;
    },
});

export default SharingNotification;
