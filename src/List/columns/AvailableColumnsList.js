import { AvailableDataElement as AvailableColumn } from '../../EditModel/event-program/create-data-entry-form/DataElementPicker.component';
import React from 'react';
import PropTypes from 'prop-types';


const styles = {
    availableColumnElement: {
        flex: '1 0 25%',
        margin: '0 5px 0 0',
        maxWidth: '235px',
    },
    availableColumnsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    disabledElement: {},
    availableColumnsItem: {},
};

const AvailableColumnsList = ({ columns, onClick, selectedColumns }) => {
    return (
        <div style={styles.availableColumnsContainer}>
            {columns.map(column => {
                //adhere to availabledataelement api
                const toDataElement = {
                    id: column.value,
                    displayName: column.displayValue,
                };
                const active = selectedColumns.find(
                    col => col.value === column.value
                );
                return (
                    <div
                        key={column.value}
                        style={styles.availableColumnElement}
                    >
                        <AvailableColumn
                            dataElement={toDataElement}
                            pickDataElement={() => onClick(column)}
                            active={!!active}
                            key={column.value}
                        />
                    </div>
                );
            })}
        </div>
    );
};

AvailableColumnsList.PropTypes = {
    columns: PropTypes.array,
    onClick: PropTypes.func,
    selectedColumns: PropTypes.array
};

export default AvailableColumnsList;