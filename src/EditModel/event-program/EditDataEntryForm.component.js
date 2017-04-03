import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import Heading from 'd2-ui/lib/headings/Heading.component';

const containerPaperStyle = {
    width: '100%',
    margin: '0 auto 2rem',
    padding: '2rem 5rem 4rem',
    position: 'relative',
};

const sectionPaperStyle = {
    width: '100%',
    marginBottom: '1rem',
};

const sectionContentStyle = {
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    padding: '1rem 1rem',
};

const sectionHeaderStyle = {
    padding: '0.5rem 1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8e8e8'
};

const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
}

const SortableSection = SortableElement(({ sectionData, onToggleOpen }) =>
    <CollapsibleSection
        dataElements={sectionData.dataElements}
        sectionName={sectionData.sectionName}
        open={sectionData.open}
        onToggleOpen={onToggleOpen}
    />
);

const DragHandle = SortableHandle(() =>
    <FontIcon
        className='material-icons'
        style={{
            color: 'gray',
        }}
    >reorder</FontIcon>
);

class CollapsibleSection extends Component {
    render() {
        return (
            <Paper style={sectionPaperStyle} zDepth={1}>
                <div onClick={this.props.onToggleOpen} style={sectionHeaderStyle}>
                    <div style={rowStyle}>
                        <DragHandle />
                        <Heading level={3} style={{ padding: '8px 12px 8px' }}>{this.props.sectionName}</Heading>
                    </div>
                    <FontIcon className="material-icons" style={{ color: 'gray' }}>
                        {this.props.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </FontIcon>
                </div>

                { this.props.open &&
                    <div style={sectionContentStyle}>
                        { this.props.dataElements.map((element, index) => (
                            <div key={index}>{element}</div>
                        ))}
                    </div>
                }
            </Paper>
        );
    }
}

CollapsibleSection.propTypes = {
    sectionName: PropTypes.string.isRequired,
    dataElements: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
}

const mockDataElements = [
    [
        'Ambigous data element',
        'Unambigous data element',
        'Incomprehensible data element',
    ],
    [
        'Death by Thomas the Tank Engine',
        'One fourth of a hamburger from McDonald\'s',
        'Nothing is more useless than hardcoding diseases',
        'I am not sure if even these are diseases at all.',
    ],
    [
        'Marcus og Martinus fandom',
    ],
];

const SortableSectionList = SortableContainer(({ sections, onToggleSection }) => (
    <SectionList sections={sections} onToggleSection={onToggleSection} />
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
                        key={`item-${index}`}
                        index={index}
                        sectionData={{
                            sectionName: section.sectionName,
                            dataElements: section.dataElements,
                            open: section.open,
                        }}
                        onToggleOpen={() => {
                            this.onToggleSection(index);
                        }}
                    />
                ))}
            </div>
        );
    }
}

class EditDataEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [
                {
                    sectionName: 'Section 1',
                    dataElements: mockDataElements[0],
                    open: false,
                },
                {
                    sectionName: 'Section 2',
                    dataElements: mockDataElements[1],
                    open: false,
                },
                {
                    sectionName: 'Section 3',
                    dataElements: mockDataElements[2],
                    open: false,
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

    render() {
        return (
            <Paper style={containerPaperStyle}>
                <SortableSectionList
                    sections={this.state.sections}
                    onToggleSection={this.onToggleSection}
                    onSortEnd={this.onSortEnd}
                    useDragHandle={true}
                />
            </Paper>
        );
    }
}

const ConnectedEditDataEntryForm = connect(
  (state) => ({
    ...state,
  }),
  (dispatch) => ({}),
)(EditDataEntryForm);

export default ConnectedEditDataEntryForm;
