import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export class SessionExpiredModal extends Component {
    static propTypes = {};

    handleOk = () => {
        //Let server handle redirect
        window.location.reload();
    };

    render() {
        const actions = [
            <FlatButton label="Ok" primary={true} onClick={this.handleOk} />,
        ];

        return (
            <div>
                <Dialog
                    title="Session expired"
                    actions={actions}
                    modal={true}
                    open={this.props.expired}
                >
                    Your session has expired. Click OK to log in again.
                </Dialog>
            </div>
        );
    }
}

SessionExpiredModal.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => ({
    expired: state.session.expired,
});

const mapDispatchToProps = dispatch => ({});

SessionExpiredModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionExpiredModal);
export default SessionExpiredModal;
