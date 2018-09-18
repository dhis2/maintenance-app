import React, { Component, PropTypes } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import { sortBy, find, isEqual, getOr, pull, flatten, filter, findIndex, negate, difference } from 'lodash/fp';
import Snackbar from 'material-ui/Snackbar';

import SectionList from './SectionList.component';
import AddOrEditSection from './AddOrEditSection.component';
import DataElementPicker from './DataElementPicker.component';

const styles = {
    sectionForm: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'space-between',
    },
};

const getActiveDataElements = programStageSections =>
    flatten(programStageSections.map(section => section.dataElements));

class SectionForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            collapsedSections: [],
            activeDataElements: getActiveDataElements(this.props.programStageSections),
            selectedSectionId: getOr(-1, 'programStageSections[0].id', this.props.programStageSections),
            editingSection: null,
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

    onToggleEditing = (section) => {
        this.setState({
            editingSection: this.state.editingSection && isEqual(section.id, this.state.editingSection.id)
                ? null
                : section,
        });
    };

    getTranslation = key =>
        this.context.d2.i18n.getTranslation(key);

    clearEditingSection = () => {
        this.setState({ editingSection: null });
    }

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

    onSectionUpdated = (sectionId, newSectionData) => {
        this.props.onSectionUpdated(sectionId, newSectionData);
        this.clearEditingSection();
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

    render = () => {
        return (
            <div style={styles.sectionForm}>
                <div style={{ flex: 2 }}>
                    <SectionList
                        useDragHandle
                        distance={4}
                        sections={this.props.programStageSections}
                        selectedSectionId={this.state.selectedSectionId}
                        collapsedSections={this.state.collapsedSections}
                        onToggleSection={this.onToggleSection}
                        onToggleEditing={this.onToggleEditing}
                        onSelectSection={this.onSelectSection}
                        onSectionRemoved={this.props.onSectionRemoved}
                        onDataElementRemoved={this.removeDataElementFromSection}
                        onSortEnd={this.onSortEnd}
                        sortItems={this.sortItems}
                    />
                    <AddOrEditSection
                        onSectionAdded={this.props.onSectionAdded}
                        onSectionUpdated={this.onSectionUpdated}
                        editingSection={this.state.editingSection}
                        clearEditingSection={this.clearEditingSection}
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
        )
    };
}

SectionForm.PropTypes = {
    onSectionUpdated: PropTypes.func.isRequired,
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
