import React from 'react';
import IconPicker from 'd2-ui/lib/icon-picker/IconPicker.component';

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
        .map((option) => option.value);

    return (
        <IconPicker {...otherProps} options={iconPickerOptions} onChange={transformChange} />
    );
}

IconPickerField.propTypes = IconPicker.propTypes;
