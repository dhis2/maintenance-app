import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { blue500 } from 'material-ui/styles/colors';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import DragHandle from './DragHandle.component';
import SortableDataList from './SortableDataList.component';

const mockDataElements = [
    'Ambigous data element',
    'Unambigous data element',
    'Incomprehensible data element',
    'Death by Thomas the Tank Engine',
    'One fourth of a hamburger from McDonald\'s',
    'This is a common data element',
    'This is another really common data element.',
    'Crazy data element',
];

class EditDefaultEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataElements: mockDataElements,
        }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            dataElements: arrayMove(this.state.dataElements, oldIndex, newIndex),
        });
    }

    render() {
        return (
            <div>
                <SortableDataList
                    darkItems
                    items={this.state.dataElements}
                    onSortEnd={this.onSortEnd}
                />
            </div>
        );
    }
}

export default EditDefaultEntryForm;
