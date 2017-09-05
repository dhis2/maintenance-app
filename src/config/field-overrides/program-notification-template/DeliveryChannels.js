import React from 'react';
import Checkbox from 'material-ui/Checkbox';

const createOnCheckFor = toCheck => (values, onChange) => () => {
    if (values.has(toCheck)) {
        values.delete(toCheck);
    } else {
        values.add(toCheck);
    }

    onChange({
        target: {
            value: Array.from(values),
        },
    });
};

const onChangeSMS = createOnCheckFor('SMS');
const onChangeEMAIL = createOnCheckFor('EMAIL');

function DeliveryChannels({ value = [], onChange }) {
    const valueSet = new Set(value);

    return (
        <div>
            <Checkbox
                label="SMS"
                checked={valueSet.has('SMS')}
                onCheck={onChangeSMS(valueSet, onChange)}
            />
            <Checkbox
                label="EMAIL"
                checked={valueSet.has('EMAIL')}
                onCheck={onChangeEMAIL(valueSet, onChange)}
            />
        </div>
    );
}

export default DeliveryChannels;
