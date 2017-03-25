import React, { PropTypes } from 'react';
// import SubjectAndMessageTemplateFields from './validation-notification-template/SubjectAndMessageTemplateFields';
import Checkbox from 'material-ui/Checkbox';
import { isEqual } from 'lodash/fp';

const createOnCheckFor = (toCheck) => (values, onChange) => () => {
    if (values.has(toCheck)) {
        values.delete(toCheck);
    }

    return {
        target: {
            value: Array.from(values),
        },
    };
};

const onChangeSMS = createOnCheckFor('SMS');
const onChangeEMAIL = createOnCheckFor('EMAIL');

export default new Map([
    ['deliveryChannels', {
        component: ({ value = [], onChange }) => {
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
            )
        },
    }]
]);
