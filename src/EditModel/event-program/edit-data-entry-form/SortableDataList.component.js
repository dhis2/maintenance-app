import React, { Component, PropTypes } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import DragHandle from './DragHandle.component';

const rowStyle = {
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
};

const SortableDataList = SortableContainer(({ items, isSortingIndex, darkItems }) => (
    <div>
        { items.map((item, index) => (
            <SortableDataElement
                index={index}
                darkItems={darkItems}
                sortIndex={index}
                key={`item-${index}`}
                item={item}
                isSortingIndex={isSortingIndex}
            />
        ))}
    </div>
));

const SortableDataElement = SortableElement(({ index, sortIndex, item, isSortingIndex, darkItems }) => (
    <DataElement index={index} sortIndex={sortIndex} item={item} isSortingIndex={isSortingIndex} darkItems={darkItems} />
));

class DataElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hovering: false,
        };
    }

    onMouseOver = () => {
        this.setState({ hovering: true });
    }

    onMouseOut = () => {
        this.setState({ hovering: false });
    }

    isSorting = () => (this.props.isSortingIndex === this.props.sortIndex)
    isHovering = () => (this.props.isSortingIndex === null && this.state.hovering)
    shouldHighlight = () => {
        return this.isSorting() || this.isHovering()
    }

    getBackgroundColor = () => {
        if (this.props.darkItems) {
            return 'rgb(243, 243, 243)';
        }

        return 'white';
    }

    getStyle = () => {
        return {
            padding: '1rem 1rem',
            backgroundColor: this.getBackgroundColor(),
            marginBottom: '4px',
            borderRadius: '8px',
        };
    }

    render() {
        const shouldHighlight = this.shouldHighlight();
        return (
            <div
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                style={this.getStyle()}
            >
                <div style={rowStyle}>
                    <div style={{
                        color: 'rgb(255, 152, 0)',
                        fontSize: '1.4rem',
                        marginRight: '1rem',
                    }}>
                        {this.props.sortIndex + 1}
                    </div>
                    {this.props.item}
                </div>
            </div>
        )
    }
}

DataElement.propTypes = {
    sortIndex: PropTypes.number.isRequired,
}

export default SortableDataList;
