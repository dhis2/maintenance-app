import React, { Component, PropTypes } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { isEqual } from 'lodash/fp';

import Section from './Section.component';

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
            <Section
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
                onSectionRemoved={() => { onSectionRemoved(section); }}
                onDataElementRemoved={(dataElementId) => { onDataElementRemoved(dataElementId, section.id); }}
                sortItems={({ oldIndex, newIndex }) => { sortItems(index, oldIndex, newIndex); }}
            />
            ))}
    </div>
);

export default SortableContainer(SectionList);;