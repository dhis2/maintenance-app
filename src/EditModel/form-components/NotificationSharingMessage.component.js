import React from 'react';
import PropTypes from 'prop-types';

import FontIcon from 'material-ui/FontIcon/FontIcon';
import Paper from 'material-ui/Paper/Paper';

import { withAuth } from '../../utils/Auth';

const styles = {
    notificationStyle: {
        background: 'none',
        margin: '14px 0 0 -4px',
    },
    notificationTextStyle: {
        verticalAlign: 'super',
        lineHeight: '24px',
        paddingLeft: '.5rem',
    },
};

function NotificationSharingMessage({ modelType, style, getModelDefinitionByName, getCurrentUser, show }, context) {
    const modelDef = getModelDefinitionByName(modelType);
    const createPublic = getCurrentUser().canCreatePublic(modelDef);
    const createPrivate = getCurrentUser().canCreatePrivate(modelDef);

    const icon = createPublic ? 'lock_open' : 'lock';
    const message = createPublic ? 'object_will_created_public' : 'object_will_created_private';
    const notificationMessage = context.d2.i18n.getTranslation(message);

    if (show && (createPublic || createPrivate)) {
        return (
            <Paper style={{ ...style, ...styles.notificationStyle }} zDepth={0}>
                <FontIcon className="material-icons">{icon}</FontIcon>
                <span style={styles.notificationTextStyle}>{notificationMessage}</span>
            </Paper>
        );
    }
    return null;
}

NotificationSharingMessage.propTypes = {
    modelType: PropTypes.string.isRequired,
    style: PropTypes.object,
    getModelDefinitionByName: PropTypes.func.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    show: PropTypes.bool,
};
NotificationSharingMessage.defaultProps = {
    style: {},
    show: true,
};
NotificationSharingMessage.contextTypes = { d2: React.PropTypes.any };

export default withAuth(NotificationSharingMessage);
