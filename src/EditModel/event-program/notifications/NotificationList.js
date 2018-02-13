import React, { PropTypes } from 'react';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import getContext from 'recompose/getContext';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderNothing from 'recompose/renderNothing';

function AddButton({ onAddClick }) {
    const cssStyles = {
        textAlign: 'right',
        marginTop: '1rem',
        bottom: '1.5rem',
        right: '1.5rem',
        position: 'fixed',
        zIndex: 10,
    };

    return (
        <div style={cssStyles}>
            <FloatingActionButton onClick={onAddClick}>
                <AddIcon />
            </FloatingActionButton>
        </div>
    );
}

const hideIfNotAuthorizedToCreate = compose(
    getContext({ d2: PropTypes.object }),
    branch(
        ({ d2, modelType }) => !(d2.currentUser.canCreate(d2.models[modelType])),
        renderNothing,
    ),
);

const AddButtonWithAuthCheck = hideIfNotAuthorizedToCreate(AddButton);

export default function NotificationList({ notifications, onRemoveNotification, onEditNotification, onAddNotification }) {
    return (
        <div>
            <AddButtonWithAuthCheck
                modelType="programNotificationTemplate"
                onAddClick={onAddNotification}
            />
            <DataTable
                rows={notifications}
                columns={['name', 'lastUpdated']}
                contextMenuActions={{ // TODO: Check for permissions
                    edit: onEditNotification,
                    delete: onRemoveNotification,
                }}
                primaryAction={onEditNotification}
            />
        </div>
    );
}
NotificationList.propTypes = {
    notifications: PropTypes.array,
};
