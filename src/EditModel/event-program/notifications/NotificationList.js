import React, { PropTypes } from 'react';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';

export default function NotificationList({ notifications, onRemoveNotification, onEditNotification }) {
    return (
        <DataTable
            rows={notifications}
            columns={[ 'displayName', 'lastUpdated' ]}
            contextMenuActions={{
                edit: onEditNotification,
                delete: onRemoveNotification,
            }}
        />
    );
}
NotificationList.propTypes = {
    notifications: PropTypes.array,
};
