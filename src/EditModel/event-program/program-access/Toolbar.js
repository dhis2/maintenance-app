import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CheckIcon from 'material-ui/svg-icons/action/done-all';
import ClearIcon from 'material-ui/svg-icons/content/clear';

const Toolbar = ({ selectAll, deselectAll, areAllSelected, areNoneSelected }) => (
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
            disabled={areAllSelected}
            style={{ height: 45 }}
            icon={<CheckIcon />}
            label="Select all"
            onClick={selectAll}
        />
    </div>
);

export default Toolbar;
