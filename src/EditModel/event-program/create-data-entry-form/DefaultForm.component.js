import PropTypes from 'prop-types';
import React from 'react';
import SortableDataList from './SortableDataList.component';

const DefaultForm = ({ availableDataElements, onChange }) => (
    <SortableDataList
        darkItems
        dataElements={availableDataElements}
        onSortEnd={onChange}
    />
);

DefaultForm.propTypes = {
    availableDataElements: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DefaultForm;
