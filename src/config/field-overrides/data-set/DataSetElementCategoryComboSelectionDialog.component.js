import React, { PropTypes } from 'react';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import IconButton from 'material-ui/IconButton/IconButton';
import BuildIcon from 'material-ui/svg-icons/action/build';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Column from 'd2-ui/lib/layout/Column.component';
import Row from 'd2-ui/lib/layout/Row.component';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import { map, memoize } from 'lodash/fp';

const enhance = compose(
    getContext({ d2: PropTypes.object }),
    withState('open', 'updateOpen', false),
    withHandlers({
        onRequestClose: props => () => {
            props.updateOpen(false);
        },
        onRequestOpen: props => () => {
            props.updateOpen(true);
        },
    })
);

const getOptions = memoize(function (categoryCombos) {
    return map(({ displayName, id}) => (
        <MenuItem key={id} primaryText={displayName} value={id} />
    ), categoryCombos);
});

const enhanceCategoryComboSelectField = compose(
    getContext({
        d2: PropTypes.object,
    }),
    withHandlers({
        onChange: ({ categoryCombos = new Map, onChange }) => (event, index, value) => {
            onChange(categoryCombos.find(categoryCombo => categoryCombo.id === value));
        },
    })
);

const CategoryComboSelectField = enhanceCategoryComboSelectField(
    function CategoryComboSelectField({ categoryCombos, value, onChange, d2 }) {
        const options = [<MenuItem key="none" label=" " primaryText={d2.i18n.getTranslation('none')} value={undefined} />]
            .concat(getOptions(categoryCombos));

        return (
            <SelectField
                value={value}
                onChange={onChange}
                fullWidth
                floatingLabelText={d2.i18n.getTranslation('override_data_element_category_combo')}
            >
                {options}
            </SelectField>
        );
    }
);

function DataSetElementList({ dataSetElements, categoryCombos, onCategoryComboSelected }) {
    const styles = {
        elementListItem: {
            width: '49%',
        },
    };

    const dataSetElementsRows = dataSetElements
        .sort((left, right) => ((left.dataElement && left.dataElement.displayName || '').localeCompare(right.dataElement && right.dataElement.displayName)))
        .map(({ categoryCombo = {}, dataElement = {}, id }) => {
            return (
                <Row key={id} style={{ alignItems: 'center' }}>
                    <div style={styles.elementListItem}>{dataElement.displayName}</div>
                    <div style={styles.elementListItem}>
                        <CategoryComboSelectField
                            categoryCombos={categoryCombos}
                            value={categoryCombo.id}
                            onChange={(categoryCombo) => onCategoryComboSelected(id, categoryCombo)}
                        />
                    </div>
                </Row>
            )
        });

    return (
        <Column>
            {dataSetElementsRows}
        </Column>
    );
}

export function DataSetElementCategoryComboSelection(props) {
    const {
        categoryCombos,
        dataSetElements,
        onCategoryComboSelected,
        d2: { i18n }
    } = props;

    const actions = [
        <FlatButton
            label={i18n.getTranslation('close')}
            primary={true}
            onTouchTap={props.onRequestClose}
        />,
    ];

    return (
        <div>
            <IconButton
                onClick={props.onRequestOpen}
                tooltip={i18n.getTranslation('Override the data element category combination')}
                tooltipPosition="top-left"
            >
                <BuildIcon />
            </IconButton>
            <Dialog
                title={i18n.getTranslation('Override the data element category combination')}
                open={props.open}
                onRequestClose={props.onRequestClose}
                actions={actions}
                modal
                autoScrollBodyContent
            >
                <DataSetElementList
                    dataSetElements={Array.from(dataSetElements.values())}
                    categoryCombos={categoryCombos}
                    onCategoryComboSelected={onCategoryComboSelected}
                />
            </Dialog>
        </div>
    );
}

export default enhance(DataSetElementCategoryComboSelection);
