import React from 'react';
import ColorPicker from 'd2-ui/lib/legend/ColorPicker.component';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import FieldWrapper from './helpers/FieldWrapper';

export default function ColorPickerField(props, context) {
    function transformChange(value) {
        props.onChange({
            target: {
                value,
            },
        });
    }

    return (
        <div>
            <FieldWrapper label={context.d2.i18n.getTranslation('color')}>
                <ColorPicker
                    color={props.value || context.d2.i18n.getTranslation('select_color')}
                    {...props}
                    onChange={transformChange}
                />
            </FieldWrapper>
            <Divider />
        </div>
    );
}
ColorPickerField.defaultProps = {
    PickerComponent: null,
};
ColorPickerField.propTypes = {
    ...ColorPicker.propTypes,
    PickerComponent: PropTypes.node,
};

ColorPickerField.contextTypes = {
    d2: PropTypes.object,
};
