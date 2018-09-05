import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    SortableContainer,
    SortableElement,
    arrayMove,
} from 'react-sortable-hoc';
import DragHandle from '../../EditModel/event-program/create-data-entry-form/DragHandle.component';
import { grey100, grey200 } from 'material-ui/styles/colors';
import ActionButton from '../../EditModel/event-program/create-data-entry-form/ActionButton.component';
const styles = {
    dataElement: {
        padding: '1rem 1rem',
        backgroundColor: grey200,
        marginBottom: '4px',
        margin: '0 5px 5px 0px',
        display: 'flex',
        flex: '1',
    },

    row: {
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
    },

    horizontalSpace: {
        paddingLeft: '1rem',
    },
    selectedColumnsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

const DataElement = ({ value, onRemoveItem }) => (
    <div style={styles.dataElement}>
        <div style={styles.row}>
            <DragHandle />
            <div style={styles.horizontalSpace} />
            {value.displayValue}
        </div>
    </div>
);

DataElement.propTypes = {
    value: PropTypes.string,
};

const SortableItem = SortableElement(DataElement);
const SortableDataList = SortableContainer(
    ({ items, isSortingIndex, onRemoveItem }) => (
        <div style={styles.selectedColumnsContainer}>
            {items.map((item, index) => (
                <SortableItem
                    index={index}
                    isSortingIndex={isSortingIndex}
                    key={`item-${index}`}
                    sortIndex={index}
                    value={item}
                    onRemoveItem={() => onRemoveItem(index, item.value)}
                />
            ))}
        </div>
    )
);

class ColumnList extends Component {
    render() {
        return (
            <SortableDataList
                items={this.props.items}
                onSortEnd={this.props.onSortEnd}
                axis="xy"
                onRemoveItem={this.props.onRemoveItem}
                helperClass="sortableModalHelper"
                useDragHandle
            />
        );
    }
}

ColumnList.PropTypes = {
    items: PropTypes.shape({
        value: PropTypes.any,
        displayValue: PropTypes.string
    }),
    columns: PropTypes.array,
};

export default ColumnList;
