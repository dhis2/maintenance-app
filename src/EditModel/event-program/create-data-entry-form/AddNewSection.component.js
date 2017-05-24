import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
    container: {
        textAlign: 'right',
        width: '100%',
    },
};

class AddNewSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            sectionName: '',
        };
    }

    openDialog = () => {
        this.setState({ dialogOpen: true });
    };

    closeDialog = () => {
        this.setState({ dialogOpen: false });
    };

    clearName = () => {
        this.setState({ sectionName: '' });
    };

    confirmAddNewSection = () => {
        this.closeDialog();
        this.props.onSectionAdded(this.state.sectionName);
        this.clearName();
    };

    onNameChanged = (event, sectionName) => {
        this.setState({ sectionName })
    };

    focusOnSectionName = input => {
        if (input) {
            setTimeout(() => { input.focus(); }, 20);
        }
    };

    render = () => {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.closeDialog}
            />,
            <FlatButton
                label="Add"
                primary={true}
                disabled={!this.state.sectionName}
                onTouchTap={this.confirmAddNewSection}
            />,
        ];

        return (
            <div style={styles.container}>
                <FloatingActionButton onTouchTap={this.openDialog}>
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    title="Add new program stage section"
                    actions={actions}
                    open={this.state.dialogOpen}
                    onRequestClose={this.closeDialog}
                >
                    <TextField
                        ref={this.focusOnSectionName}
                        hintText={'Name'}
                        onChange={this.onNameChanged}
                    />
                </Dialog>
            </div>
        );
    }
}

AddNewSection.propTypes = {
    onSectionAdded: PropTypes.func.isRequired,
};

export default AddNewSection;
