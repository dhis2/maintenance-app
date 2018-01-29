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

import Section from './Section.component';
import SectionList from './SectionList.component';
import SortableSectionDataList from './SortableSectionDataList.component';
import AddNewSection from './AddNewSection.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import DataElementPicker from './DataElementPicker.component';
import { grey300, grey800 } from 'material-ui/styles/colors';

const maxNameLength = 230;

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
                <SectionList
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
