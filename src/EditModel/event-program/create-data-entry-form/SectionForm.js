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

const getActiveElements = (sections, elementPath) =>
    flatten(sections.map(section => section[elementPath]));

class SectionForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            collapsedSections: [],
            activeElements: getActiveElements(props.sections, props.elementPath),
            selectedSectionId: props.sections[0] && props.sections[0].id || -1,
            editingSection: null,
            showNoSelectionSectionMessage: false,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.sections !== this.props.sections) {
            this.setState({
                activeElements: getActiveElements(newProps.sections, this.props.elementPath),
            });

            const newSectionAdded = difference(newProps.sections, this.props.sections)[0];
            if (newSectionAdded) {
                this.selectSection(newSectionAdded.id);
            }
        }
    }

    getElementsForSection = (section) => {
        const elems = section[this.props.elementPath];
        console.log('ELEMENTS', elems)
        return elems;
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
        this.props.onSectionOrderChanged(arrayMove(this.props.sections, oldIndex, newIndex));
    };

    onElementPicked = (dataElementId) => {
        const dataElementToAdd = find(dataElement =>
            isEqual(dataElement.id, dataElementId), this.props.availableElements);
        if (!dataElementToAdd) return;

        const currentSelectedSectionIndex = findIndex(section =>
            isEqual(this.state.selectedSectionId, section.id), this.props.sections);

        if (currentSelectedSectionIndex === -1) {
            this.openNoSelectionSectionMessage();
            return;
        }

        const currentSelectedSection = this.props.sections[currentSelectedSectionIndex];
        const updatedProgramStageSectionDataElements = this.getElementsForSection(currentSelectedSection).concat(dataElementToAdd)
        const updatedSections = this.props.sections;
     
        currentSelectedSection[this.props.elementPath] = updatedProgramStageSectionDataElements
        this.props.onSectionOrderChanged(updatedSections);

        this.openSectionIfClosed(currentSelectedSection.id);
    };

    removeDataElementFromSection = (dataElementId, sectionId) => {
        const programStageSectionIndex = findIndex(section =>
            isEqual(section.id, sectionId), this.props.sections);

        const currentSection = this.props.sections[programStageSectionIndex];
        const elements = this.getElementsForSection(currentSection);
        const updatedDataElements = filter(negate(dataElement =>
            isEqual(dataElement.id, dataElementId)), elements);

        const allSections = this.props.sections;
        const currSection = this.props.sections[programStageSectionIndex];
        currSection[this.props.elementPath] = updatedDataElements;

        this.props.onSectionOrderChanged(allSections);
    };

    sortItems = (sectionIndex, oldIndex, newIndex) => {
        const currentSection = this.props.sections[sectionIndex];
        const oldElements = this.getElementsForSection(currentSection);
        const dataElements = arrayMove(oldElements, oldIndex, newIndex);
        const sections = this.props.sections;
        sections[sectionIndex][this.props.elementPath] = dataElements;
        this.props.onSectionOrderChanged(sections);
    };

    render = () => {
        return (
            <div style={styles.sectionForm}>
                <div style={{ flex: 2 }}>
                    <SectionList
                        useDragHandle
                        distance={4}
                        sections={this.props.sections}
                        selectedSectionId={this.state.selectedSectionId}
                        collapsedSections={this.state.collapsedSections}
                        onToggleSection={this.onToggleSection}
                        onToggleEditing={this.onToggleEditing}
                        onSelectSection={this.onSelectSection}
                        onSectionRemoved={this.props.onSectionRemoved}
                        onDataElementRemoved={this.removeDataElementFromSection}
                        onSortEnd={this.onSortEnd}
                        sortItems={this.sortItems}
                        elementPath={this.props.elementPath}
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
                        availableDataElements={sortBy(['displayName'], this.props.availableElements)}
                        activeDataElements={this.state.activeElements}
                        onElementPicked={this.onElementPicked}
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
    availableElements: PropTypes.array.isRequired,
    sections: PropTypes.arrayOf(PropTypes.shape({
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
