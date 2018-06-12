import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {
    PROGRAM_STAGE_SECTION_RENDER_TYPES,
    DEFAULT_PROGRAM_STAGE_RENDER_TYPE,
} from './render-types';

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
            sectionDescription: '',
            sectionRenderType: DEFAULT_PROGRAM_STAGE_RENDER_TYPE,
        };
    }

    onNameChanged = (event, sectionName) => {
        this.setState({ sectionName });
    };

    onDescriptionChanged = (event, sectionDescription) => {
        this.setState({ sectionDescription });
    };

    onRenderTypeChanged = (event, index, sectionRenderType) => {
        this.setState({ sectionRenderType });
    };

    getTranslation = key =>
        this.context.d2.i18n.getTranslation(key);

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
        this.props.onSectionAdded({
            name: this.state.sectionName,
            description: this.state.sectionDescription,
            renderType: {
                MOBILE: {
                    type: this.state.sectionRenderType,
                },
                DESKTOP: {
                    type: this.state.sectionRenderType,
                },
            },
        });
        this.clearName();
    };

    focusOnSectionName = (input) => {
        if (input) {
            setTimeout(() => { input.focus(); }, 20);
        }
    };

    renderSelectField() {
        return (
            <SelectField
                floatingLabelText={this.getTranslation('render_type')}
                value={this.state.sectionRenderType}
                onChange={this.onRenderTypeChanged}
            >
                {PROGRAM_STAGE_SECTION_RENDER_TYPES.map(renderType => (
                    <MenuItem
                        key={renderType}
                        value={renderType}
                        primaryText={renderType.toLowerCase()}
                    />
                ))}
            </SelectField>
        );
    }

    render = () => {
        const actions = [
            <FlatButton
                primary
                label={this.getTranslation('cancel')}
                onTouchTap={this.closeDialog}
            />,
            <FlatButton
                primary
                label={this.getTranslation('add')}
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
                        fullWidth
                    />
                    <TextField
                        hintText={this.getTranslation('description')}
                        onChange={this.onDescriptionChanged}
                        fullWidth
                        multiLine
                        rows={2}
                        rowsMax={4}
                    />
                    {this.renderSelectField()}
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
