import React from 'react';
import IconPicker from 'd2-ui/lib/icon-picker/IconPicker.component';
import Divider from 'material-ui/Divider';

export default function IconPickerField(props) {
    function transformChange(value) {
        props.onChange({
            target: {
                value,
            },
        });
    }

    const { options, ...otherProps } = props;

    const iconPickerOptions = options
        .map(option => option.value);

    return (
        <div>
            <IconPicker {...otherProps} options={iconPickerOptions} onChange={transformChange} />
            <Divider />
        </div>
    );
}

IconPickerField.propTypes = IconPicker.propTypes;
