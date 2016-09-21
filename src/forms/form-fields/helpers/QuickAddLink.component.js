import React from 'react';
import IconButton from 'material-ui/IconButton/IconButton';
import AddCircleOutlineIcon from 'material-ui/svg-icons/content/add-circle-outline';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import { getSectionForType } from '../../../config/maintenance-models';
import { Link } from 'react-router';

export default function QuickAddLink(props) {
    const {referenceType, onRefreshClick} = props;

    const sectionForReferenceType = getSectionForType(referenceType);

    const styles = {
        quickAddWrap: {
            display: 'flex',
        },
        hidden: {
            display: 'none',
        }
    };

    if (!sectionForReferenceType) {
        return <div style={styles.hidden}></div>;
    }

    return (
        <div style={styles.quickAddWrap}>
            <Link
                to={`/edit/${sectionForReferenceType}/${referenceType}/add`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <IconButton tooltip="Add new" tooltipPosition="top-left">
                    <AddCircleOutlineIcon />
                </IconButton>
            </Link>
            <IconButton tooltip="Refresh values" tooltipPosition="top-left" onClick={onRefreshClick}>
                <RefreshIcon />
            </IconButton>
        </div>
    );
}
