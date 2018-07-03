import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { isEqual } from 'lodash/fp';

import Section from './Section.component';

const SectionList = ({
    sections,
    selectedSectionId,
    onToggleEditing,
    collapsedSections,
    onToggleSection,
    onSelectSection,
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
                onToggleEdit={() => { onToggleEditing(section); }}
                onToggleOpen={() => { onToggleSection(section.id); }}
                onSelect={() => { onSelectSection(section.id); }}
                onSectionRemoved={() => { onSectionRemoved(section); }}
                onDataElementRemoved={(dataElementId) => { onDataElementRemoved(dataElementId, section.id); }}
                sortItems={({ oldIndex, newIndex }) => { sortItems(index, oldIndex, newIndex); }}
            />
            ))}
    </div>
);

export default SortableContainer(SectionList);