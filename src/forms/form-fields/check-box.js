import React, { PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox/Checkbox';

function isTrueOrTheStringTrue(value) {
    return value === true || value === 'true';
}

function createOnClick({ onChange, value }) {
    return () => {
        onChange({
            target: {
                value: !isTrueOrTheStringTrue(value),
            },
        });
    }
}

const CheckboxWrap = (props) => {
    // Do not pass the value on to the CheckBox component
    const {
        value,
        errorStyle,
        errorText,
        labelText,
        modelDefinition,
        models,
        referenceType,
        referenceProperty,
        isInteger,
        multiLine,
        fullWidth,
        translateOptions,
        isRequired,
        options,
        model,
        ...otherProps,
    } = props;

    return (
        <div style={{ marginTop: 12, marginBottom: 12 }}>
            <Checkbox
                onClick={createOnClick(props)}
                {...otherProps}
                label={labelText}
                defaultChecked={isTrueOrTheStringTrue(value)}
            />
        </div>
    );
};

CheckboxWrap.propTypes = {
    onChange: PropTypes.func.isRequired,
    labelText: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf(['true', 'false']),
    ]),
};

export default CheckboxWrap;
