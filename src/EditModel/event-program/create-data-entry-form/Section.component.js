import React, { Component, PropTypes } from 'react';
import { grey300, grey800 } from 'material-ui/styles/colors';
import { SortableElement } from 'react-sortable-hoc';
import Heading from 'd2-ui/lib/headings/Heading.component';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import DragHandle from './DragHandle.component';
import SortableSectionDataList from './SortableSectionDataList.component';

const maxNameLength = 230;

const styles = {
    sectionContainer: {
        width: '100%',
        borderRadius: '8px',
        borderStyle: 'solid',
        borderColor: grey300,
        borderWidth: '3px',
        marginBottom: '1.2rem',
    },
    noDataElementsMessage: {
        height: '4rem',
        lineHeight: '4rem',
        borderRadius: '6px',
        backgroundColor: 'white',
        paddingLeft: '1.5rem',
    },
    sectionContent: {
        backgroundColor: grey300,
    },
    sectionHeader: {
        color: 'black',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: grey300,
        borderRadius: '4px 4px 0 0',
        paddingLeft: '1rem',
        minHeight: '55px',
    },
    collapsibleArrow: {
        color: 'black',
        cursor: 'pointer',
        transition: 'none',
        userSelect: 'none',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
};

const ActionButton = ({ onClick, icon }) => {
    const noPropagation = (e) => {
        if (e) e.stopPropagation();
        onClick();
    };

    return (
        <IconButton
            style={{ transition: 'none' }}
            iconStyle={{ transition: 'none' }}
            onClick={noPropagation}
        >
            <FontIcon color="gray" className="material-icons">{icon}</FontIcon>
        </IconButton>
    );
};

class Section extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showRemovalDialog: false,
            newName: '',
        };
    }

    onNameChanged = (event, newValue) => {
        this.setState({
            newName: newValue,
        });
    };

    onSortEnd = (oldIndex, newIndex) => {
        this.props.sortItems(oldIndex, newIndex);
    };

    getTranslation = key => this.context.d2.i18n.getTranslation(key);

    getSectionNameStyle = editing => ({
        textAlign: 'left',
        color: editing ? 'gray' : 'black',
        fontSize: '1.7rem',
        fontWeight: editing ? '300' : '400',
        wordWrap: 'break-word',
        width: '100%',
    });

    startEditingName = () => {
        this.props.onToggleEdit();
        this.setState({
            newName: '',
        });
    };

    focusTitleInputField = (titleInput) => {
        if (titleInput) {
            setTimeout(() => { titleInput.focus(); }, 20);
        }
    };

    stopEditingName = () => {
        this.props.onToggleEdit();
        if (this.state.newName && this.state.newName !== '') {
            this.props.onNameChanged(this.state.newName);
        }
    };

    openRemovalDialog = () => {
        this.setState({ showRemovalDialog: true });
    };

    closeRemovalDialog = () => {
        this.setState({ showRemovalDialog: false });
    };

    confirmSectionRemoval = () => {
        this.closeRemovalDialog();
        this.props.onSectionRemoved();
    };

    render() {
        const removalDialogActions = [
            <FlatButton
                primary
                label={this.getTranslation('cancel')}
                onTouchTap={this.closeRemovalDialog}
            />,
            <FlatButton
                primary
                label={this.getTranslation('delete')}
                onTouchTap={this.confirmSectionRemoval}
            />,
        ];

        const sectionContent = (this.props.section.dataElements.length > 0) ?
            (<div style={styles.sectionContent}>
                <SortableSectionDataList
                    distance={4}
                    onSortEnd={this.onSortEnd}
                    onDataElementRemoved={this.props.onDataElementRemoved}
                    sectionDataElements={this.props.section.dataElements}
                />
            </div>) :
            (<div style={styles.noDataElementsMessage}>
                {this.getTranslation('no_data_elements')}
            </div>);

        return (
            <div
                style={{
                    ...styles.sectionContainer,
                    borderColor: this.props.selected ? grey800 : grey300,
                }}
            >
                <div onClick={this.props.onSelect} style={styles.sectionHeader}>
                    <div style={{ ...styles.row, width: '100%' }}>
                        <DragHandle />

                        { this.props.editing
                            ? <ActionButton onClick={this.stopEditingName} icon="done" />
                            : <ActionButton onClick={this.startEditingName} icon="mode_edit" />
                        }

                        { this.props.editing
                            ? <TextField
                                ref={this.focusTitleInputField}
                                inputStyle={{ transition: 'none' }}
                                textareaStyle={{ flex: 1 }}
                                style={this.getSectionNameStyle(true)}
                                underlineShow={false}
                                onClick={(e) => e.stopPropagation()}
                                hintText={this.getTranslation('name')}
                                defaultValue={this.props.section.displayName}
                                onChange={this.onNameChanged}
                                maxLength={maxNameLength}
                            />
                            : <div style={this.getSectionNameStyle(false)}>{this.props.section.displayName}</div>
                        }
                    </div>
                    <div style={styles.row}>
                        <ActionButton
                            onClick={this.props.onToggleOpen}
                            icon={this.props.collapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                        />
                        <ActionButton onClick={this.openRemovalDialog} icon="clear" />
                    </div>
                </div>

                { !this.props.collapsed && sectionContent }

                <Dialog
                    title={this.getTranslation('delete_section_message')}
                    actions={removalDialogActions}
                    open={this.state.showRemovalDialog}
                    onRequestClose={this.closeRemovalDialog}
                >
                    <Heading level={2}>{this.props.section.displayName}</Heading>
                </Dialog>
            </div>
        );
    }
}

Section.propTypes = {
    section: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    collapsed: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    onNameChanged: PropTypes.func.isRequired,
    onSectionRemoved: PropTypes.func.isRequired,
    onDataElementRemoved: PropTypes.func.isRequired,
    onToggleEdit: PropTypes.func.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    sortItems: PropTypes.func.isRequired,
};

Section.contextTypes = {
    d2: PropTypes.object,
};

export default SortableElement(Section);
