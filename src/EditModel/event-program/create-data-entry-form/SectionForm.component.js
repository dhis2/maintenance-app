import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { concat, sortBy, find, isEqual, get, pull, without } from 'lodash/fp';
import DragHandle from './DragHandle.component';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import SortableDataList from './SortableDataList.component';
import AddNewSection from './AddNewSection.component';
import Heading from 'd2-ui/lib/headings/Heading.component';

const styles = {
    sectionPaper: {
        width: '100%',
        marginBottom: '1rem',
    },

    sectionContent: {
        backgroundColor: 'white',
    },

    sectionHeader: {
        color: 'black',
        padding: '0rem 1rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#d7d7d7',
        borderRadius: '4px 4px 0 0',
    },

    collapsibleArrow: {
        color: 'black',
        cursor: 'pointer',
        transition: 'none',
        userSelect: 'none',
    },

    row: {
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
};



const SortableSectionList = SortableContainer(({
    sections,
    collapsedSections,
    onToggleSection,
    onSectionNameChanged,
    onSectionRemoved,
    sortItems,
}) => (
    <SectionList
        sections={sections}
        collapsedSections={collapsedSections}
        onToggleSection={onToggleSection}
        onSectionNameChanged={onSectionNameChanged}
        onSectionRemoved={onSectionRemoved}
        sortItems={sortItems}
    />
));

const SectionList = ({ sections, collapsedSections, onToggleSection, onSectionNameChanged, onSectionRemoved, sortItems }) => (
    <div>
        { sections.map((section, index) => (
            <SortableSection
                key={`section-${index}`}
                index={index}
                section={section}
                collapsed={collapsedSections.includes(section.id)}
                onToggleOpen={() => { onToggleSection(section.id) }}
                onNameChanged={(sectionId, newName) => {
                    onSectionNameChanged(index, sectionId, newName);
                }}
                onSectionRemoved={() => { onSectionRemoved(section.id) }}
                sortItems={({oldIndex, newIndex}) => {
                    sortItems(index, oldIndex, newIndex);
                }}
            />
        ))}
    </div>
);

const SortableSection = SortableElement(({ section, collapsed, onToggleOpen, onNameChanged, onSectionRemoved, sortItems }) =>
    <CollapsibleSection
        section={section}
        collapsed={collapsed}
        onToggleOpen={onToggleOpen}
        onNameChanged={onNameChanged}
        onSectionRemoved={onSectionRemoved}
        sortItems={sortItems}
    />
);

class CollapsibleSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRemovalDialog: false,
            isSortingIndex: null,
            isEditingName: false,
            newName: '',
        };
    }

    onSortStart = ({ index }) => {
        this.setState({
            isSortingIndex: index,
        })
    };

    onSortEnd = (oldIndex, newIndex) => {
        this.props.sortItems(oldIndex, newIndex);
        this.setState({
            isSortingIndex: null,
        });
    };

    startEditingName = (event) => {
        event.stopPropagation();
        this.setState({
            newName: '',
            isEditingName: !this.state.isEditingName,
        });
    };

    focusTitleInputField = titleInput => {
        if (titleInput) {
            setTimeout(() => { titleInput.focus(); }, 20);
        }
    };

    stopEditingName = (event) => {
        event.stopPropagation();
        this.setState({
            isEditingName: false,
        });

        if (this.state.newName && this.state.newName !== '') {
            this.props.onNameChanged(this.props.section.id, this.state.newName);
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

    getSectionNameStyle = editing => {
        return {
            textAlign: 'center',
            color: editing ? 'gray' : 'black',
            fontSize: '1.7rem',
            fontWeight: editing ? '300' : '400',
        };
    };

    render() {
        const removalDialogActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.closeRemovalDialog}
            />,
            <FlatButton
                label="Confirm"
                primary={true}
                onTouchTap={this.confirmSectionRemoval}
            />,
        ];

        return (
            <Paper style={styles.sectionPaper} zDepth={1}>
                <div onClick={this.props.onToggleOpen} style={styles.sectionHeader}>
                    <div style={styles.row}>
                        <DragHandle />

                        { this.state.isEditingName
                            ? <ActionButton onClick={this.stopEditingName} icon="done" />
                            : <ActionButton onClick={this.startEditingName} icon="mode_edit" />
                        }

                        { this.state.isEditingName
                            ? <TextField
                                ref={this.focusTitleInputField}
                                inputStyle={{ transition: 'none' }}
                                style={this.getSectionNameStyle(true)}
                                underlineShow={false}
                                onClick={(e) => e.stopPropagation()}
                                hintText={this.props.section.displayName}
                                onChange={this.onNameChanged} />

                            : <div style={this.getSectionNameStyle(false)}>{this.props.section.displayName}</div>
                        }
                    </div>
                    <div>
                        <FontIcon className="material-icons" style={styles.collapsibleArrow}>
                            {this.props.collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </FontIcon>
                        <ActionButton onClick={this.openRemovalDialog} icon="clear" />
                    </div>
                </div>

                { this.props.collapsed &&
                    <div style={styles.sectionContent}>
                        <SortableDataList
                            onSortStart={this.onSortStart}
                            onSortEnd={this.onSortEnd}
                            isSortingIndex={this.state.isSortingIndex}
                            dataElements={this.props.section.dataElements}
                        />
                    </div>
                }

                <Dialog
                    title="Are you sure you want to remove the following section?"
                    actions={removalDialogActions}
                    open={this.state.showRemovalDialog}
                    onRequestClose={this.closeRemovalDialog}
                >
                    <Heading level={2}>{this.props.section.displayName}</Heading>
                </Dialog>
            </Paper>
        );
    }
}

const ActionButton = ({ onClick, icon }) => (
    <IconButton style={{ transition: 'none' }} iconStyle={{ transition: 'none' }} onClick={onClick}>
        <FontIcon color="gray" className="material-icons">{icon}</FontIcon>
    </IconButton>
);

CollapsibleSection.propTypes = {
    section: PropTypes.object.isRequired,
    collapsed: PropTypes.bool.isRequired,
    onNameChanged: PropTypes.func.isRequired,
    onSectionRemoved: PropTypes.func.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
    sortItems: PropTypes.func.isRequired,
};

class SectionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsedSections: this.props.programStageSections.map(section => section.id),
        };
    }

    onToggleSection = sectionId => {
        let collapsedSections = this.state.collapsedSections;
        const isCollapsed = collapsedSections.includes(sectionId);

        if (isCollapsed) {
            collapsedSections = pull(sectionId, collapsedSections);
        } else {
            collapsedSections.push(sectionId);
        }

        this.setState({ collapsedSections });
    };

    onSectionNameChanged = (index, sectionId, newName) => {
        this.props.onSectionNameChanged(sectionId, newName);
    };

    onSortEnd = ({oldIndex, newIndex}) => {
        this.props.onSectionOrderChanged(arrayMove(this.props.programStageSections, oldIndex, newIndex));
    };

    sortItems = (sectionIndex, oldIndex, newIndex) => {
        const dataElements = arrayMove(this.props.programStageSections[sectionIndex].dataElements, oldIndex, newIndex);

        let sections = this.props.programStageSections;
        sections[sectionIndex] = {
            ...sections[sectionIndex],
            dataElements,
        };

        this.props.onSectionOrderChanged(sections);
    };

    render = () => (
        <div>
            <SortableSectionList
                useDragHandle
                sections={this.props.programStageSections}
                collapsedSections={this.state.collapsedSections}
                onToggleSection={this.onToggleSection}
                onSectionNameChanged={this.onSectionNameChanged}
                onSectionRemoved={this.props.onSectionRemoved}
                onSortEnd={this.onSortEnd}
                sortItems={this.sortItems}
            />
            <AddNewSection
                onSectionAdded={this.props.onSectionAdded}
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

export default SectionForm;
