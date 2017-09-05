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
    constructor(props, context) {
        super(props, context);
        this.state = {
            dialogOpen: false,
            sectionName: '',
        };
    }

    getTranslation = key => {
        return this.context.d2.i18n.getTranslation(key);
    };

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
        this.setState({ sectionName });
    };

    focusOnSectionName = (input) => {
        if (input) {
            setTimeout(() => { input.focus(); }, 20);
        }
    };

    render = () => {
        const actions = [
            <FlatButton
                label={this.getTranslation('cancel')}
                primary={true}
                onTouchTap={this.closeDialog}
            />,
            <FlatButton
                label={this.getTranslation('add')}
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
                    title={this.getTranslation('add_new_program_stage_section')}
                    actions={actions}
                    open={this.state.dialogOpen}
                    onRequestClose={this.closeDialog}
                >
                    <TextField
                        ref={this.focusOnSectionName}
                        hintText={this.getTranslation('name')}
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

AddNewSection.contextTypes = {
    d2: PropTypes.object,
};

export default AddNewSection;
