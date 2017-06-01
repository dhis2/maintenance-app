import { addValueRenderer } from 'd2-ui/lib/data-table/data-value/valueRenderers';
import branch from 'recompose/branch';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import RemoveIcon from 'material-ui/svg-icons/content/remove';
import renderComponent from 'recompose/renderComponent';
import mapProps from 'recompose/mapProps';

const removeProps = mapProps(() => ({}));

const BooleanCellField = branch(
    ({ value }) => value === true,
    renderComponent(removeProps(CheckIcon))
)(removeProps(RemoveIcon));

// For boolean valueTypes render a check mark icon when the value is true or a dash for when it is false.
addValueRenderer(
    ({ valueType }) => valueType === 'BOOLEAN',
    BooleanCellField,
);
