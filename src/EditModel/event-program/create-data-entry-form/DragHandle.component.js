import React, { Component, PropTypes } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { blue200 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

const dragHandleColor = 'black';
const dragHandleHoverColor = blue200;

const dragHandleStyle = {
    userSelect: 'none',
    cursor: 'move',
    transition: 'none',
};

const DragHandle = SortableHandle(({ active, light }) =>
    <div style={{
        marginRight: '2rem',
    }}>
        <FontIcon
            color={active ? dragHandleHoverColor : (light ? 'white' : dragHandleColor)}
            hoverColor={dragHandleHoverColor}
            className="material-icons"
            style={dragHandleStyle}
        >reorder</FontIcon>
    </div>
);

export default DragHandle;
