import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const ActionButton = ({ onClick, icon }) => {
    const noTransition = {
        transition: 'none',
    };

    const onIconClick = (e) => {
        if (e) e.stopPropagation();
        onClick();
    }

    return (
        <IconButton style={noTransition} iconStyle={noTransition} onClick={onIconClick}>
            <FontIcon color="gray" className="material-icons">{icon}</FontIcon>
        </IconButton>
    );
};

export default ActionButton;
