import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import { grey100 } from 'material-ui/styles/colors'

const styles = {
    addNewSection: {
        padding: '0rem 1rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: grey100,
        borderRadius: '4px 4px 0 0',
        height: 50,
        fontSize: '1.7rem',
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

    confirmAddNewSection = () => {
        this.closeDialog();
        this.props.onSectionAdded(this.state.sectionName);
    };

    onNameChanged = (event, sectionName) => {
        this.setState({ sectionName })
    };

    render = () => {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.closeDialog}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                disabled={!this.state.sectionName}
                onTouchTap={this.confirmAddNewSection}
            />,
        ];

        return (
            <div>
                <Paper>
                    <div style={styles.addNewSection} onClick={this.openDialog}>
                        <FontIcon
                            className="material-icons"
                            style={{paddingRight: '3rem'}}
                        >
                            add_circle
                        </FontIcon>
                        Add new section
                    </div>
                </Paper>
                <Dialog
                    title="Add new program stage section"
                    actions={actions}
                    open={this.state.dialogOpen}
                    onRequestClose={this.closeDialog}
                >
                    <div>
                        Choose a name for the new section
                    </div>
                    <TextField
                        hintText={'New section'}
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
