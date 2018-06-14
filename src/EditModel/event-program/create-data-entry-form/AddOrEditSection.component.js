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
    MOBILE, DESKTOP,
} from '../render-types';

const styles = {
    container: {
        textAlign: 'right',
        width: '100%',
    },
    selectField: {
        [DESKTOP]: {
            marginRight: '1rem',
        },
        [MOBILE]: {},
    },
};

const initialState = {
    dialogOpen: false,
    section: {
        id: null,
        name: '',
        description: '',
        renderType: {
            MOBILE: {
                type: DEFAULT_PROGRAM_STAGE_RENDER_TYPE,
            },
            DESKTOP: {
                type: DEFAULT_PROGRAM_STAGE_RENDER_TYPE,
            },
        },
    },
};

const rendertypeMenuItems = PROGRAM_STAGE_SECTION_RENDER_TYPES.map(type => (
    <MenuItem
        key={type}
        value={type}
        primaryText={type.toLowerCase()}
    />
));

class AddOrEditSection extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
    }

    componentDidUpdate(prevProps) {
        if (this.props.editingSection && !prevProps.editingSection) {
            this.showDialogForEditingModel(this.props.editingSection);
        }
    }

    onNameChanged = (event, sectionName) => {
        this.setState({ section: { ...this.state.section, name: sectionName } });
    };

    onDescriptionChanged = (event, sectionDescription) => {
        this.setState({ section: { ...this.state.section, description: sectionDescription } });
    };

    onRenderTypeChanged = (deviceType, sectionRenderType) => {
        this.setState({
            section: {
                ...this.state.section,
                renderType: {
                    ...this.state.section.renderType,
                    [deviceType]: {
                        type: sectionRenderType,
                    },
                },
            },
        });
    };

    getTranslation = key =>
        this.context.d2.i18n.getTranslation(key);

    getSaveData() {
        const { section } = this.state;
        return {
            ...section,
            renderType: {
                MOBILE: {
                    type: section.renderType,
                },
                DESKTOP: {
                    type: section.renderType,
                },
            },
        };
    }

    showDialogForEditingModel(editingSection) {
        const { id, name, description, renderType } = editingSection;
        this.setState({
            dialogOpen: true,
            section: {
                id,
                name,
                description,
                renderType: {
                    MOBILE: {
                        type: renderType ? renderType.MOBILE.type : DEFAULT_PROGRAM_STAGE_RENDER_TYPE,
                    },
                    DESKTOP: {
                        type: renderType ? renderType.DESKTOP.type : DEFAULT_PROGRAM_STAGE_RENDER_TYPE,
                    },
                },
            },
        });
    }

    closeDialog = () => {
        this.props.clearEditingSection();
        this.setState({ ...initialState });
    };

    openDialog = () => {
        this.setState({ dialogOpen: true });
    };

    confirmAddNewSection = () => {
        this.closeDialog();
        this.props.onSectionAdded(this.state.section);
    };

    confirmUpdateSection = () => {
        const { section } = this.state;
        this.closeDialog();
        this.props.onSectionUpdated(section.id, section);
    }

    focusOnSectionName = (input) => {
        if (input) {
            setTimeout(() => { input.focus(); }, 20);
        }
    };

    renderSelectField(deviceType) {
        const translationKey = `render_type_${deviceType.toLowerCase()}`;
        return (
            <SelectField
                floatingLabelText={this.getTranslation(translationKey)}
                value={this.state.section.renderType[deviceType].type}
                onChange={(event, index, sectionRenderType) => this.onRenderTypeChanged(deviceType, sectionRenderType)}
                style={styles.selectField[deviceType]}
            >
                { rendertypeMenuItems }
            </SelectField>
        );
    }

    render = () => {
        const { id, name, description } = this.state.section;

        let titleTxt;
        let confirmHandler;
        let confirmTxt;
        if (id) {
            titleTxt = this.getTranslation('update_program_stage_section');
            confirmHandler = this.confirmUpdateSection;
            confirmTxt = this.getTranslation('update');
        } else {
            titleTxt = this.getTranslation('add_new_program_stage_section');
            confirmHandler = this.confirmAddNewSection;
            confirmTxt = this.getTranslation('add');
        }

        const actions = [
            <FlatButton
                primary
                label={this.getTranslation('cancel')}
                onTouchTap={this.closeDialog}
            />,
            <FlatButton
                primary
                label={confirmTxt}
                disabled={!name}
                onTouchTap={confirmHandler}
            />,
        ];

        return (
            <div style={styles.container}>
                <FloatingActionButton onTouchTap={this.openDialog}>
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    title={titleTxt}
                    actions={actions}
                    open={this.state.dialogOpen}
                    onRequestClose={this.closeDialog}
                >
                    <TextField
                        ref={this.focusOnSectionName}
                        hintText={this.getTranslation('name')}
                        onChange={this.onNameChanged}
                        value={name}
                        fullWidth
                    />
                    <TextField
                        hintText={this.getTranslation('description')}
                        onChange={this.onDescriptionChanged}
                        value={description}
                        fullWidth
                        multiLine
                        rows={2}
                        rowsMax={4}
                    />
                    {this.renderSelectField(DESKTOP)}
                    {this.renderSelectField(MOBILE)}
                </Dialog>
            </div>
        );
    }
}

AddOrEditSection.propTypes = {
    onSectionAdded: PropTypes.func.isRequired,
    onSectionUpdated: PropTypes.func.isRequired,
    editingSection: PropTypes.object,
    clearEditingSection: PropTypes.func.isRequired,
};

AddOrEditSection.defaultProps = {
    editingSection: null,
};

AddOrEditSection.contextTypes = {
    d2: PropTypes.object,
};

export default AddOrEditSection;
