import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingMask from '../loading-mask/LoadingMask.component';
import Error from './Error';

const styles = {
    errorContainer: {
        position: 'fixed',
        top: '45%',
    },
};
export class AppLoading extends Component {
    renderError() {
        const { error, expired } = this.props;
        let message = error && error.message ? error.message : '';
        if (expired || error.httpStatusCode === 401) {
            message = `Session has expired. Are you sure you are logged in?`;
        }

        return (
            <Error
                style={styles.errorContainer}
                message={message}
                retry={() => window.location.reload()}
            />
        );
    }

    render() {
        const { error, expired } = this.props;
        if (error || expired) return this.renderError();

        return <LoadingMask />;
    }
}

AppLoading.propTypes = {
    error: PropTypes.oneOfType([
        PropTypes.shape({
            httpStatusCode: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired,
        }),
        PropTypes.string,
    ]),
    expired: PropTypes.bool,
};
const mapStateToProps = state => ({
    error: state.appLoad.error,
    expired: state.session.expired,
});

export default connect(mapStateToProps)(AppLoading);
