import mapProps from 'recompose/mapProps';
import branch from 'recompose/branch';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import renderComponent from 'recompose/renderComponent';
import nest from 'recompose/nest';
import { green500, red500 } from 'material-ui/styles/colors';

const ExpressionInvalidIcon = nest('span', mapProps(props => ({ color: red500 }))(RemoveIcon));
const ExpressionValidIcon = nest('span', mapProps(props => ({ color: green500 }))(CheckIcon));

const ExpressionStatusIcon = branch(
    props => props.status,
    renderComponent(ExpressionValidIcon),
)(ExpressionInvalidIcon);

export default ExpressionStatusIcon;
