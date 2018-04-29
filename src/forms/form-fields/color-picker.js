import React from 'react';
import ColorPicker from 'd2-ui/lib/legend/ColorPicker.component';
import Divider from 'material-ui/Divider';


const styles = {
    field: {
        display: 'inline-block',
        padding: '1rem 0',
    },
    colorPickerLabel: {
        transformOrigin: 'left top 0px',
        color: 'rgba(0, 0, 0, 0.498039)',
        transform: 'scale(.75)',
        fontSize: '18px',
    },
};

export default function ColorPickerField(props) {
    function transformChange(value) {
        props.onChange({
            target: {
                value,
            },
        });
    }

    return (
        <div>
            <div style={styles.field} >
                <div style={styles.colorPickerLabel}> Color </div>
                <ColorPicker color={props.value || 'Select color'} {...props} onChange={transformChange} />
            </div>
            <Divider />
        </div>
    );
}

ColorPickerField.propTypes = ColorPicker.propTypes;
