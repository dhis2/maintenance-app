import React, { PropTypes } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import DragHandle from './DragHandle.component';
import { grey100 } from "material-ui/styles/colors";
import { ActionButton } from './SectionForm.component';

const styles = {
    dataElement: {
        height: '4rem',
        display: 'flex',
        paddingLeft: '1rem',
        backgroundColor: grey100,
        borderRadius: '6px',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    row: {
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    horizontalSpace: {
        paddingLeft: '1rem',
    },
};

const SortableSectionDataList = SortableContainer(({ sectionDataElements, onDataElementRemoved }) => {
    return <div>
        { sectionDataElements.map((dataElement, index) => (
            <SortableSectionDataElement
                dataElement={dataElement}
                onRemove={() => { onDataElementRemoved(dataElement.id); }}
                index={index}
                key={`item-${index}`}
                sortIndex={index}
            />
        ))}
    </div>;
});

const SortableSectionDataElement = SortableElement(({ index, sortIndex, dataElement, onRemove }) => (
    <SectionDataElement first={sortIndex === 0} index={index} sortOrder={sortIndex} dataElement={dataElement} onRemove={onRemove} />
));

const SectionDataElement = ({ first, sortOrder, dataElement, onRemove }) => (
    <div style={{
        ...styles.dataElement,
        marginTop: first ? '0px' : '4px',
    }}>
        <div style={styles.row}>
            <DragHandle />
            <div style={styles.horizontalSpace} />
            {dataElement.displayName}
        </div>
        <ActionButton onClick={onRemove} icon="clear" />
    </div>
);

SectionDataElement.propTypes = {
    dataElement: PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
    }),
};

export default SortableSectionDataList;
