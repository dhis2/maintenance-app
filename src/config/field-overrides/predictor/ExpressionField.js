import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import expressionStatusStore from './expressionStatusStore';
import ExpressionDialog from './ExpressionDialog';

class ExpressionField extends Component {
    state = {
        open: false,
        value: this.props.value,
    };

    handleOpen = () => {
        // Clear previous expression validation status
        expressionStatusStore.setState({});
        this.setState({ open: true, value: this.props.value });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSaveAndClose = () => {
        this.setState({ open: false }, () => {
            this.props.onChange({
                target: {
                    value: this.state.value,
                },
            });
        });
    };

    indicatorExpressionChanged = ({ formula, description }) => {
        this.setState({
            value: Object.assign({}, this.state.value, { expression: formula, description }),
        });
    };

    render() {
        const props = this.props;
        const styles = {
            fieldWrap: {
                padding: '1rem 0',
            },

            errorText: {
                paddingTop: '0.5rem',
                color: 'red',
            },
        };

        return (
            <div style={styles.fieldWrap}>
                <RaisedButton
                    label={this.props.labelText}
                    onTouchTap={this.handleOpen}
                />
                {props.errorText ? <div style={styles.errorText}>{props.errorText}</div> : null}
                <ExpressionDialog
                    {...props}
                    open={this.state.open}
                    handleClose={this.handleClose}
                    handleSaveAndClose={this.handleSaveAndClose}
                    indicatorExpressionChanged={this.indicatorExpressionChanged}
                />
            </div>
        );
    }
}
ExpressionField.defaultProps = {
    indicatorExpressionChanged: () => {},
};
ExpressionField.contextTypes = {
    d2: PropTypes.object,
};

export default ExpressionField;