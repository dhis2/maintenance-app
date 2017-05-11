import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { grey100 } from 'material-ui/styles/colors';
import DragHandle from './DragHandle.component';
import SortableDataList from './SortableDataList.component';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

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

const SortableSectionList = SortableContainer(({ sections, onToggleSection, onSectionNameChanged, sortItems }) => (
    <SectionList sections={sections} onToggleSection={onToggleSection} onSectionNameChanged={onSectionNameChanged} sortItems={sortItems} />
));

const SectionList = ({ sections, onToggleSection, onSectionNameChanged, sortItems }) => (
    <div>
        { sections.map((section, index) => (
            <SortableSection
                key={`section-${index}`}
                index={index}
                sectionData={{
                    sectionName: section.sectionName,
                    dataElements: section.dataElements,
                    open: section.open,
                }}
                onToggleOpen={() => { onToggleSection(index) }}
                onNameChanged={(newName) => {
                    onSectionNameChanged(index, newName);
                }}
                sortItems={({oldIndex, newIndex}) => {
                    sortItems(index, oldIndex, newIndex);
                }}
            />
        ))}
    </div>
);

const SortableSection = SortableElement(({ sectionData, onToggleOpen, onNameChanged, sortItems }) =>
    <CollapsibleSection
        dataElements={sectionData.dataElements}
        sectionName={sectionData.sectionName}
        open={sectionData.open}
        onToggleOpen={onToggleOpen}
        onNameChanged={onNameChanged}
        sortItems={sortItems}
    />
);

class CollapsibleSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            console.warn('Sending', this.state.newName);
            this.props.onNameChanged(this.state.newName);
        }
    }

    onNameChanged = (event, newValue) => {
        this.setState({
            newName: newValue,
        });
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
        return (
            <Paper style={styles.sectionPaper} zDepth={1}>
                <div onClick={this.props.onToggleOpen} style={styles.sectionHeader}>
                    <div style={styles.row}>
                        <DragHandle />

                        { this.state.isEditingName ?
                            <IconButton style={{ transition: 'none' }} iconStyle={{ transition: 'none' }} onClick={this.stopEditingName}>
                                <FontIcon color="gray" className="material-icons">done</FontIcon>
                            </IconButton> :
                            <IconButton style={{ transition: 'none' }} iconStyle={{ transition: 'none' }} onClick={this.startEditingName}>
                                <FontIcon color="gray" className="material-icons">mode_edit</FontIcon>
                            </IconButton>
                        }

                        { this.state.isEditingName
                            ? <TextField
                                ref={this.focusTitleInputField}
                                inputStyle={{ transition: 'none' }}
                                style={this.getSectionNameStyle(true)}
                                underlineShow={false}
                                onClick={(e) => e.stopPropagation()}
                                hintText={this.props.sectionName}
                                onChange={this.onNameChanged} />

                            : <div style={this.getSectionNameStyle(false)}>{this.props.sectionName}</div>
                        }
                    </div>
                    <FontIcon className="material-icons" style={styles.collapsibleArrow}>
                        {this.props.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </FontIcon>
                </div>

                { this.props.open &&
                    <div style={styles.sectionContent}>
                        <SortableDataList
                            onSortStart={this.onSortStart}
                            onSortEnd={this.onSortEnd}
                            isSortingIndex={this.state.isSortingIndex}
                            dataElements={this.props.dataElements}
                        />
                    </div>
                }
            </Paper>
        );
    }
}

CollapsibleSection.propTypes = {
    dataElements: PropTypes.array.isRequired,
    sectionName: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onNameChanged: PropTypes.func.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
    sortItems: PropTypes.func.isRequired,
};

class SectionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: this.props.sections.map(section => ({
                open: true,
                sectionName: section.displayName,
                dataElements: this.getDataElementsForSection(section),
            })),
        };
    }

    getDataElementsForSection = (section) => {
        return section.dataElements.map(dataElement => {
            for (let i = 0; i < this.props.dataElements.length; i++) {
                const otherElement = this.props.dataElements[i];
                if (dataElement.id === otherElement.id) {
                    return {
                        ...dataElement,
                        displayName: otherElement.displayName,
                    };
                }
            }

            return dataElement;
        });
    }

    onToggleSection = (index) => {
        const newSection = {
            ...this.state.sections[index],
            open: !this.state.sections[index].open,
        };

        let sections = this.state.sections;
        sections[index] = newSection;

        this.setState({
            sections,
        });
    }

    onSectionNameChanged = (index, newName) => {
        const newSection = {
            ...this.state.sections[index],
            sectionName: newName,
        };

        let sections = this.state.sections;
        sections[index] = newSection;

        this.setState({
            sections,
        });
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            sections: arrayMove(this.state.sections, oldIndex, newIndex),
        });
    };

    sortItems = (sectionIndex, oldIndex, newIndex) => {
        const dataElements = arrayMove(this.state.sections[sectionIndex].dataElements, oldIndex, newIndex);
        let newSection = {
            ...this.state.sections[sectionIndex],
            dataElements,
        }

        let sections = this.state.sections;
        sections[sectionIndex] = newSection;

        this.setState({
            sections,
        });
    };

    render() {
        return (
            <div>
                <SortableSectionList
                    useDragHandle
                    sections={this.state.sections}
                    onToggleSection={this.onToggleSection}
                    onSectionNameChanged={this.onSectionNameChanged}
                    onSortEnd={this.onSortEnd}
                    sortItems={this.sortItems}
                />
                <AddNewSection />
            </div>
        );
    }
}

const AddNewSection = () => (
    <Paper>
        <div style={styles.addNewSection}>
            <FontIcon
                className="material-icons"
                style={{ paddingRight: '3rem' }}
            >
                add_circle
            </FontIcon>
            Add new section
        </div>
    </Paper>
);

export default SectionForm;
