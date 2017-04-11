import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { blue500 } from 'material-ui/styles/colors';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import DragHandle from './DragHandle.component';
import SortableDataList from './SortableDataList.component';

const sectionPaperStyle = {
    width: '100%',
    marginBottom: '1rem',
};

const sectionContentStyle = {
    backgroundColor: 'rgb(243, 243, 243)',
};

const sectionHeaderStyle = {
    color: 'white',
    padding: '0rem 1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: blue500,
    borderRadius: '4px 4px 0 0',
};

const collapsibleArrowStyle = {
    color: 'white',
    transition: 'none',
};

const rowStyle = {
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
};

const mockDataElements = [
    [
        'Ambigous data element',
        'Unambigous data element',
        'Incomprehensible data element',
    ],
    [
        'Death by Thomas the Tank Engine',
        'One fourth of a hamburger from McDonald\'s',
        'This is a common data element',
        'This is another really common data element.',
    ],
    [
        'Crazy data element',
    ],
];

// SORTABLE SECTIONS

const SortableSectionList = SortableContainer(({ sections, onToggleSection, sortItems }) => (
    <SectionList sections={sections} onToggleSection={onToggleSection} sortItems={sortItems} />
));

class SectionList extends Component {
    onToggleSection = (index) => {
        this.props.onToggleSection(index);
    }

    render() {
        return (
            <div>
                { this.props.sections.map((section, index) => (
                    <SortableSection
                        key={`section-${index}`}
                        index={index}
                        sectionData={{
                            sectionName: section.sectionName,
                            dataElements: section.dataElements,
                            open: section.open,
                        }}
                        onToggleOpen={() => {
                            this.onToggleSection(index);
                        }}
                        sortItems={({oldIndex, newIndex}) => {
                            this.props.sortItems(index, oldIndex, newIndex);
                        }}
                    />
                ))}
            </div>
        );
    }
}

const SortableSection = SortableElement(({ sectionData, onToggleOpen, sortItems }) =>
    <CollapsibleSection
        dataElements={sectionData.dataElements}
        sectionName={sectionData.sectionName}
        open={sectionData.open}
        onToggleOpen={onToggleOpen}
        sortItems={sortItems}
    />
);

class CollapsibleSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSortingIndex: null,
        };
    }

    onSortStart = ({ index }) => {
        this.setState({
            isSortingIndex: index,
        })
    }

    onSortEnd = (oldIndex, newIndex) => {
        this.props.sortItems(oldIndex, newIndex);
        this.setState({
            isSortingIndex: null,
        })
    }

    render() {
        return (
            <Paper style={sectionPaperStyle} zDepth={1}>
                <div onClick={this.props.onToggleOpen} style={sectionHeaderStyle}>
                    <div style={rowStyle}>
                        <DragHandle />
                        <Heading level={4} style={{ padding: '1rem 0', color: 'white' }}>{this.props.sectionName}</Heading>
                    </div>
                    <FontIcon className="material-icons" style={collapsibleArrowStyle}>
                        {this.props.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </FontIcon>
                </div>

                { this.props.open &&
                    <div style={sectionContentStyle}>
                        <SortableDataList
                            onSortStart={this.onSortStart}
                            onSortEnd={this.onSortEnd}
                            isSortingIndex={this.state.isSortingIndex}
                            items={this.props.dataElements}
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
    onToggleOpen: PropTypes.func.isRequired,
    sortItems: PropTypes.func.isRequired,
}

class EditSectionEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [
                {
                    sectionName: 'Section 1',
                    dataElements: mockDataElements[0],
                    open: true,
                },
                {
                    sectionName: 'Section 2',
                    dataElements: mockDataElements[1],
                    open: true,
                },
                {
                    sectionName: 'Section 3',
                    dataElements: mockDataElements[2],
                    open: true,
                },
            ],
        }
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
        })
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            sections: arrayMove(this.state.sections, oldIndex, newIndex),
        });
    }

    onSortDataEnd = ({oldIndex, newIndex}) => {
        this.sortItems(0, oldIndex, newIndex);
    }

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
    }

    render() {
        return (
            <div>
                <SortableSectionList
                    useDragHandle
                    sections={this.state.sections}
                    onToggleSection={this.onToggleSection}
                    onSortEnd={this.onSortEnd}
                    sortItems={this.sortItems}
                />
            </div>
        );
    }
}

export default EditSectionEntryForm;
