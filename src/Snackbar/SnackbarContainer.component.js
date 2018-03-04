import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import { get } from 'lodash/fp';
import { hideSnackBarMessage } from './actions';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

const snackBarMessageSelector = get('snackBar.message');
const snackBarActionHandlerSelector = get('snackBar.onActionTouchTap');
const snackBarActionTextSelector = get('snackBar.action');
const snackBarActionAutoHideSelector = get('snackBar.autoHideDuration');
const snackBarTranslate = get('snackBar.translate');

let SnackBar = (props, { d2 }) => (
    <Snackbar
        style={{maxWidth: 'auto', zIndex: 5}}
        bodyStyle={{maxWidth: 'auto'}}
        message={props.translate ? d2.i18n.getTranslation(props.message) : props.message}
        action={props.action}
        autoHideDuration={props.autoHideDuration}
        open={!!props.message}
        onActionTouchTap={props.actionHandler}
        onRequestClose={props.onRequestClose}
/>);
SnackBar = addD2Context(SnackBar);

const mapStateToProps = state => (
    {
        message: snackBarMessageSelector(state) || '',
        action: snackBarActionTextSelector(state) || '',
        autoHideDuration: snackBarActionAutoHideSelector(state) || 0,
        actionHandler: snackBarActionHandlerSelector(state) || null,
        translate: snackBarTranslate(state) || false,
    }
);

const mapDispatchToProps = dispatch => ({
    onRequestClose: (...args) => dispatch(hideSnackBarMessage(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SnackBar);

SnackBar.propTypes = {
    message: PropTypes.string.isRequired,
    action: PropTypes.string,
    actionHandler: PropTypes.func,
    autoHideDuration: PropTypes.number,
    onRequestClose: PropTypes.func,
};
