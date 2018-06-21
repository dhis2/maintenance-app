import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import DoneAllIcon from 'material-ui/svg-icons/action/done-all';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ClearIcon from 'material-ui/svg-icons/content/clear';

const Toolbar = ({ selectAll, selectSimilar, deselectAll, areAllSelected, areNoneSelected }) => (
    <div
        style={{
            alignSelf: 'flex-end',
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }}
    >
        <FlatButton
            primary
            labelPosition="before"
            disabled={areNoneSelected}
            style={{ height: 45 }}
            icon={<ClearIcon />}
            label="Deselect all"
            onClick={deselectAll}
        />
        <FlatButton
            primary
            labelPosition="before"
            style={{ height: 45 }}
            icon={<DoneIcon />}
            label="Select similar"
            onClick={selectSimilar}
        />
        <FlatButton
            primary
            labelPosition="before"
            disabled={areAllSelected}
            style={{ height: 45 }}
            icon={<DoneAllIcon />}
            label="Select all"
            onClick={selectAll}
        />
    </div>
);

export default Toolbar;
