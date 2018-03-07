import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import { get } from 'lodash/fp';
import { hideSnackBarMessage } from './actions';

const snackBarMessageSelector = get('snackBar.message');
const snackBarActionHandlerSelector = get('snackBar.onActionTouchTap');
const snackBarActionTextSelector = get('snackBar.action');
const snackBarActionAutoHideSelector = get('snackBar.autoHideDuration');

const SnackBar = props => (
    <Snackbar
        style={{ maxWidth: 'auto', zIndex: 5 }}
        bodyStyle={{ maxWidth: 'auto' }}
        message={props.message}
        action={props.action}
        autoHideDuration={props.autoHideDuration}
        open={!!props.message}
        // if no onActionTouchTap is provided, action will default to close
        onActionTouchTap={props.actionHandler ? props.actionHandler : props.onRequestClose}
        onRequestClose={props.onRequestClose}
    />
);

const mapStateToProps = state => (
    {
        message: snackBarMessageSelector(state),
        action: snackBarActionTextSelector(state),
        autoHideDuration: snackBarActionAutoHideSelector(state),
        actionHandler: snackBarActionHandlerSelector(state),
    }
);

const mapDispatchToProps = dispatch => ({
    onRequestClose: (...args) => dispatch(hideSnackBarMessage({ ...args })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SnackBar);

SnackBar.propTypes = {
    message: PropTypes.string.isRequired,
    action: PropTypes.string,
    actionHandler: PropTypes.func,
    autoHideDuration: PropTypes.number,
    onRequestClose: PropTypes.func.isRequired,
};

SnackBar.defaultProps = {
    action: '',
    actionHandler: null,
    autoHideDuration: 0,
};
