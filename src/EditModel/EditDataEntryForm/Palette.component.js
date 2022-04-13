import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField/TextField';
import CheckBox from 'material-ui/Checkbox/Checkbox';
import PaletteSection from './PaletteSection.component';

const styles = {
    paletteFilter: {
        position: 'absolute',
        top: -16,
        width: '100%',
        padding: '8px 8px 16px',
    },
    paletteFilterField: {
        width: '100%',
    },
    greySwitch: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
    },
}

const Palette = ({
    getTranslation,
    usedIds,
    insertFn,
    sections,
    paletteWidth,
    onStartResize,
    insertGrey,
    onToggleGrey,
    filter,
    onFilterChange
}) => {
    const [expand, setExpand] = useState('data_elements');

    return (
        <div className="paletteContainer" style={{ width: paletteWidth }}>
            <div className="resizeHandle" onMouseDown={onStartResize} />
            <div className="palette">
                <div style={styles.paletteFilter}>
                    <TextField
                        floatingLabelText={getTranslation('filter_elements')}
                        style={styles.paletteFilterField}
                        onChange={onFilterChange}
                    />
                </div>
                <div className="elements">
                    {sections.map(section =>
                        <PaletteSection
                            key={section.label}
                            usedIds={usedIds}
                            insertFn={insertFn}
                            expanded={expand === section.label}
                            onExpand={() => setExpand(section.label)}
                            keySet={section.keySet}
                            label={getTranslation(section.label)}
                            filter={filter}
                        />
                    )}
                </div>
                <CheckBox
                    label={getTranslation('insert_grey_fields')}
                    labelPosition="right"
                    style={styles.greySwitch}
                    onCheck={(e, value) => onToggleGrey(value)}
                    checked={insertGrey}
                />
            </div>
        </div>
    );
};

Palette.propTypes = {
    getTranslation: PropTypes.func.isRequired,
    usedIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    insertFn: PropTypes.object.isRequired,
    sections: PropTypes.arrayOf(PropTypes.shape({
        keySet: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    paletteWidth: PropTypes.number.isRequired,
    onStartResize: PropTypes.func.isRequired,
    insertGrey: PropTypes.bool,
    onToggleGrey: PropTypes.func.isRequired,
    filter: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    onFilterChange: PropTypes.func.isRequired,
};

export default Palette;
