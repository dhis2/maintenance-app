import React, { Component, PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { concat, sortBy, find, isEqual, get, getOr, pull, without, flatten, filter, findIndex, negate, difference } from 'lodash/fp';
import DragHandle from './DragHandle.component';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import SortableSectionDataList from './SortableSectionDataList.component';
import AddNewSection from './AddNewSection.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import DataElementPicker from './DataElementPicker.component';
import { grey300, grey800 } from 'material-ui/styles/colors';

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

    sectionForm: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'space-between',
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

const SortableSectionList = SortableContainer(({
    sections,
    selectedSectionId,
    editingSectionId,
    collapsedSections,
    onToggleSection,
    onToggleEditing,
    onSelectSection,
    onSectionNameChanged,
    onSectionRemoved,
    onDataElementRemoved,
    sortItems,
}) => (
    <SectionList
        sections={sections}
        selectedSectionId={selectedSectionId}
        editingSectionId={editingSectionId}
        collapsedSections={collapsedSections}
        onToggleEditing={onToggleEditing}
        onToggleSection={onToggleSection}
        onSelectSection={onSelectSection}
        onSectionNameChanged={onSectionNameChanged}
        onSectionRemoved={onSectionRemoved}
        onDataElementRemoved={onDataElementRemoved}
        sortItems={sortItems}
    />
));

const SectionList = ({
    sections,
    selectedSectionId,
    editingSectionId,
    onToggleEditing,
    collapsedSections,
    onToggleSection,
    onSelectSection,
    onSectionNameChanged,
    onSectionRemoved,
    onDataElementRemoved,
    sortItems,
}) => (
    <div>
        { sections.map((section, index) => (
            <SortableSection
                key={`section-${index}`}
                index={index}
                section={section}
                selected={isEqual(section.id, selectedSectionId)}
                collapsed={collapsedSections.includes(section.id)}
                editing={isEqual(section.id, editingSectionId)}
                onToggleEdit={() => { onToggleEditing(section.id); }}
                onToggleOpen={() => { onToggleSection(section.id); }}
                onSelect={() => { onSelectSection(section.id); }}
                onNameChanged={(newName) => { onSectionNameChanged(section.id, newName); }}
                onSectionRemoved={() => { onSectionRemoved(section.id); }}
                onDataElementRemoved={(dataElementId) => { onDataElementRemoved(dataElementId, section.id); }}
                sortItems={({ oldIndex, newIndex }) => { sortItems(index, oldIndex, newIndex); }}
            />
            ))}
    </div>
);

const SortableSection = SortableElement(({
    section,
    selected,
    collapsed,
    editing,
    onToggleOpen,
    onToggleEdit,
    onSelect,
    onNameChanged,
    onSectionRemoved,
    onDataElementRemoved,
    sortItems,
}) =>
    <CollapsibleSection
        section={section}
        selected={selected}
        collapsed={collapsed}
        editing={editing}
        onToggleOpen={onToggleOpen}
        onToggleEdit={onToggleEdit}
        onSelect={onSelect}
        onNameChanged={onNameChanged}
        onSectionRemoved={onSectionRemoved}
        onDataElementRemoved={onDataElementRemoved}
        sortItems={sortItems}
    />
);

class CollapsibleSection extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showRemovalDialog: false,
            newName: '',
        };
    }

    getTranslation = key => {
        return this.context.d2.i18n.getTranslation(key);
    };

    onSortEnd = (oldIndex, newIndex) => {
        this.props.sortItems(oldIndex, newIndex);
    };

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

    onNameChanged = (event, newValue) => {
        this.setState({
            newName: newValue,
        });
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

    getSectionNameStyle = editing => ({
        textAlign: 'left',
        color: editing ? 'gray' : 'black',
        fontSize: '1.7rem',
        fontWeight: editing ? '300' : '400',
        wordWrap: 'break-word',
        width: '100%',
    });

    render() {
        const removalDialogActions = [
            <FlatButton
                label={this.getTranslation('cancel')}
                primary={true}
                onTouchTap={this.closeRemovalDialog}
            />,
            <FlatButton
                label={this.getTranslation('delete')}
                primary={true}
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
                No data elements
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

CollapsibleSection.propTypes = {
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

CollapsibleSection.contextTypes = {
    d2: PropTypes.object,
};

export const ActionButton = ({ onClick, icon }) => (
    <IconButton
        style={{ transition: 'none' }} iconStyle={{ transition: 'none' }} onClick={(e) => {
            e && e.stopPropagation();
            onClick();
        }}
    >
        <FontIcon color="gray" className="material-icons">{icon}</FontIcon>
    </IconButton>
);

const getActiveDataElements = programStageSections =>
    flatten(programStageSections.map(section => section.dataElements));

class SectionForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            collapsedSections: [],
            activeDataElements: getActiveDataElements(this.props.programStageSections),
            selectedSectionId: getOr(-1, 'programStageSections[0].id', this.props.programStageSections),
            editingSectionId: null,
            showNoSelectionSectionMessage: false,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.programStageSections !== this.props.programStageSections) {
            this.setState({
                activeDataElements: getActiveDataElements(newProps.programStageSections),
            });

            const newSectionAdded = difference(newProps.programStageSections, this.props.programStageSections)[0];
            if (newSectionAdded) {
                this.selectSection(newSectionAdded.id);
            }
        }
    }

    getTranslation = key => {
        return this.context.d2.i18n.getTranslation(key);
    };

    openSection = (sectionId) => {
        this.setState({
            collapsedSections: pull(sectionId, this.state.collapsedSections),
        });
    };

    closeSection = (sectionId) => {
        const collapsedSections = this.state.collapsedSections;
        collapsedSections.push(sectionId);
        this.setState({
            collapsedSections,
        });
    };

    selectSection = (sectionId) => {
        this.setState({
            selectedSectionId: sectionId,
        });
    };

    onToggleEditing = (sectionId) => {
        this.setState({
            editingSectionId: isEqual(sectionId, this.state.editingSectionId)
                ? null
                : sectionId,
        });
    };

    openNoSelectionSectionMessage = () => {
        this.setState({
            showNoSelectionSectionMessage: true,
        });
    };

    closeNoSelectionSectionMessage = () => {
        this.setState({
            showNoSelectionSectionMessage: false,
        });
    };

    isSectionCollapsed = sectionId => this.state.collapsedSections.includes(sectionId);

    onToggleSection = (sectionId) => {
        this.isSectionCollapsed(sectionId)
            ? this.openSection(sectionId)
            : this.closeSection(sectionId);
    };

    openSectionIfClosed = (sectionId) => {
        this.isSectionCollapsed(sectionId) && this.openSection(sectionId);
    };

    onSelectSection = (sectionId) => {
        this.openSectionIfClosed(sectionId);
        this.selectSection(sectionId);
    };

    onSectionNameChanged = (sectionId, newName) => {
        this.props.onSectionNameChanged(sectionId, newName);
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.props.onSectionOrderChanged(arrayMove(this.props.programStageSections, oldIndex, newIndex));
    };

    onDataElementPicked = (dataElementId) => {
        const dataElementToAdd = find(dataElement =>
            isEqual(dataElement.id, dataElementId), this.props.availableDataElements);

        if (!dataElementToAdd) return;

        const currentSelectedSectionIndex = findIndex(section =>
            isEqual(this.state.selectedSectionId, section.id), this.props.programStageSections);

        if (currentSelectedSectionIndex === -1) {
            this.openNoSelectionSectionMessage();
            return;
        }

        const currentSelectedSection = this.props.programStageSections[currentSelectedSectionIndex];
        const updatedProgramStageSectionDataElements = currentSelectedSection.dataElements.concat(dataElementToAdd);
        const updatedSections = this.props.programStageSections;

        updatedSections[currentSelectedSectionIndex].dataElements = updatedProgramStageSectionDataElements;
        this.props.onSectionOrderChanged(updatedSections);

        this.openSectionIfClosed(currentSelectedSection.id);
    };

    removeDataElementFromSection = (dataElementId, sectionId) => {
        const programStageSectionIndex = findIndex(section =>
            isEqual(section.id, sectionId), this.props.programStageSections);

        const programStageSection = this.props.programStageSections[programStageSectionIndex];
        const updatedDataElements = filter(negate(dataElement =>
            isEqual(dataElement.id, dataElementId)), programStageSection.dataElements);

        const allSections = this.props.programStageSections;
        allSections[programStageSectionIndex].dataElements = updatedDataElements;

        this.props.onSectionOrderChanged(allSections);
    };

    sortItems = (sectionIndex, oldIndex, newIndex) => {
        const dataElements = arrayMove(this.props.programStageSections[sectionIndex].dataElements, oldIndex, newIndex);
        const sections = this.props.programStageSections;
        sections[sectionIndex].dataElements = dataElements;
        this.props.onSectionOrderChanged(sections);
    };

    render = () => (
        <div style={styles.sectionForm}>
            <div style={{ flex: 2 }}>
                <SortableSectionList
                    useDragHandle
                    distance={4}
                    sections={this.props.programStageSections}
                    selectedSectionId={this.state.selectedSectionId}
                    editingSectionId={this.state.editingSectionId}
                    collapsedSections={this.state.collapsedSections}
                    onToggleSection={this.onToggleSection}
                    onToggleEditing={this.onToggleEditing}
                    onSelectSection={this.onSelectSection}
                    onSectionNameChanged={this.onSectionNameChanged}
                    onSectionRemoved={this.props.onSectionRemoved}
                    onDataElementRemoved={this.removeDataElementFromSection}
                    onSortEnd={this.onSortEnd}
                    sortItems={this.sortItems}
                />
                <AddNewSection
                    onSectionAdded={this.props.onSectionAdded}
                />
            </div>
            <div style={{ flex: 1 }}>
                <DataElementPicker
                    availableDataElements={sortBy(['displayName'], this.props.availableDataElements)}
                    activeDataElements={this.state.activeDataElements}
                    onElementPicked={this.onDataElementPicked}
                />
            </div>
            <Snackbar
                open={this.state.showNoSelectionSectionMessage}
                message={this.getTranslation('no_section_selected_error')}
                autoHideDuration={3000}
                onRequestClose={this.closeNoSelectionSectionMessage}
            />
        </div>
    );
}

SectionForm.PropTypes = {
    onSectionNameChanged: PropTypes.func.isRequired,
    onSectionOrderChanged: PropTypes.func.isRequired,
    onSectionAdded: PropTypes.func.isRequired,
    onSectionRemoved: PropTypes.func.isRequired,
    availableDataElements: PropTypes.array.isRequired,
    programStageSections: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        sortOrder: PropTypes.number.isRequired,
        displayName: PropTypes.string.isRequired,
        dataElements: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
        })).isRequired,
    })).isRequired,
};

SectionForm.contextTypes = {
    d2: PropTypes.object,
};

export default SectionForm;
