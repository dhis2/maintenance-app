import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

const SaveButton = React.createClass({
    propTypes: {
        isFormValid: React.PropTypes.func.isRequired,
        onClick: React.PropTypes.func.isRequired,
    },

    render() {
        const saveButtonStyle = {
            marginRight: '1rem',
        };

        return (
            <RaisedButton style={saveButtonStyle} primary={true} onClick={this.props.onClick} label={'Save'} disabled={!this.props.isFormValid()} />
        );
    },
});

export default SaveButton;
