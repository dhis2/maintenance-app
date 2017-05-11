import React, { PropTypes } from 'react';
import SortableDataList from './SortableDataList.component';

const DefaultForm = ({ programDataElements, onChange }) => (
        <SortableDataList
            darkItems
            dataElements={programDataElements}
            onSortEnd={onChange}
        />
);

DefaultForm.propTypes = {
    programDataElements: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DefaultForm;
