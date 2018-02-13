
import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { get, getOr, __ } from 'lodash/fp';

import { TableRow, TableRowColumn, Checkbox } from 'material-ui';

const flipBooleanPropertyOn = (object, key) => ({
    ...object,
    [key]: !object[key],
});

const AttributeRow = ({ attribute, onEditAttribute, isDateValue, displayName, isUnique, hasOptionSet }, { d2 }) => {
    const onChangeFlipBooleanForProperty = propertyName => () => onEditAttribute(
        flipBooleanPropertyOn(attribute, propertyName),
    );
    const isCheckedForProp = getOr(false, __, attribute);

    return (
        <TableRow>
            <TableRowColumn>{displayName}</TableRowColumn>
            <TableRowColumn>
                <Checkbox
                    checked={isCheckedForProp('displayInList')}
                    onClick={onChangeFlipBooleanForProperty('displayInList')}
                />
            </TableRowColumn>
            <TableRowColumn>
                <Checkbox
                    checked={isCheckedForProp('mandatory')}
                    onClick={onChangeFlipBooleanForProperty('mandatory')}
                />
            </TableRowColumn>
            <TableRowColumn>
                {isDateValue && <Checkbox
                    checked={isCheckedForProp('allowFutureDate')}
                    onClick={onChangeFlipBooleanForProperty('allowFutureDate')}
                />}
            </TableRowColumn>
            <TableRowColumn>
                {hasOptionSet && <Checkbox
                    checked={isCheckedForProp('renderOptionsAsRadio')}
                    onClick={onChangeFlipBooleanForProperty('renderOptionsAsRadio')}
                />}
            </TableRowColumn>
            <TableRowColumn>
                <Checkbox
                    checked={isUnique || isCheckedForProp('searchable')}
                    disabled={isUnique}
                    onClick={onChangeFlipBooleanForProperty('searchable')}
                    title={d2.i18n.getTranslation('unique_attributes_always_searchable')}
                />
            </TableRowColumn>
        </TableRow>);
};

AttributeRow.propTypes = {
    displayName: PropTypes.string.isRequired,
    attribute: PropTypes.object.isRequired,
    onEditAttribute: PropTypes.func.isRequired,
    isUnique: PropTypes.bool,
    isDateValue: PropTypes.bool,
    hasOptionSet: PropTypes.bool,
};

AttributeRow.defaultProps = {
    isDateValue: false,
    isUnique: false,
    hasOptionSet: false,
};

AttributeRow.contextTypes = {
    d2: PropTypes.object,
};
export default pure(AttributeRow);
