import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';

export default React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired,
        isActive: React.PropTypes.bool.isRequired,
        style: React.PropTypes.object,
    },

    contextTypes: {
        muiTheme: React.PropTypes.object,
    },

    render() {
        const {
            label,
            style,
            isActive,
            ...rest,
        } = this.props;

        const theme = this.context.muiTheme;
        const listStyle = {
            backgroundColor: isActive ? theme.sideBar.backgroundColorItemActive : theme.sideBar.backgroundColorItem,
            color: isActive ? theme.sideBar.textColorActive : theme.sideBar.textColor,
            fontSize: 14,
            fontWeight: isActive ? 'bold' : 'inherit',
        };

        return (
            <ListItem
                primaryText={label}
                style={Object.assign({}, listStyle, style)}
                {...rest}
            />
        );
    },
});
