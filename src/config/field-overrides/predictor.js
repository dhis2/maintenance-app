import { SELECT } from '../../forms/fields';
import ExpressionManager from 'd2-ui/lib/expression-manager/ExpressionManager';
import Store from 'd2-ui/lib/store/Store';
import Action from 'd2-ui/lib/action/Action';
import { getInstance } from 'd2/lib/d2';
import { Observable } from 'rx';
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import periodTypes from '../periodTypes';

const expressionStatusStore = Store.create();

const expressionStatusActions = Action.createActionsFromNames(['requestExpressionStatus']);
expressionStatusActions.requestExpressionStatus
    .throttle(500)
    .map(action => {
        const encodedFormula = encodeURIComponent(action.data);
        const url = `expressions/description?expression=${encodedFormula}`;
        const request = getInstance()
            .then(d2 => {
                return d2.Api.getApi().get(url);
            });

        return Observable.fromPromise(request);
    })
    .concatAll()
    .subscribe(response => {
        expressionStatusStore.setState(response);
    });

function ExpressionDialog({ open, handleClose, handleSaveAndClose, ...props }) {
    const customContentStyle = {
        width: '100%',
        maxWidth: 'none',
    };

    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={handleClose}
        />,
        <FlatButton
            label="Submit"
            primary={true}
            onTouchTap={handleSaveAndClose}
        />,
    ];

    return (
        <Dialog
            open={open}
            actions={actions}
            contentStyle={customContentStyle}
            style={{padding: '1rem'}}
            onRequestClose={handleClose}
        >
            <ExpressionManager
                descriptionLabel={'description'}
                descriptionValue={props.value ? props.value.description : ''}
                formulaValue={props.value ? props.value.expression : ''}
                expressionStatusStore={expressionStatusStore}
                expressionChanged={props.indicatorExpressionChanged}
                titleText={props.labelText}
            />
        </Dialog>
    );
}

class ExpressionField extends Component {
    state = {
        open: false,
        value: this.props.value,
    };

    handleOpen = () => {
        // Clear previous expression validation status
        expressionStatusStore.setState({});
        this.setState({open: true, value: this.props.value});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleSaveAndClose = () => {
        this.setState({ open: false }, () => {
            this.props.onChange({
                target: {
                    value: this.state.value,
                }
            });
        });
    };

    indicatorExpressionChanged = ({ formula, description }) => {
        this.setState({
            value: Object.assign({}, this.state.value, { expression: formula, description, }),
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

export default new Map([
    ['periodType', {
        type: SELECT,
        fieldOptions: {
            options: periodTypes,
        },
    }],
    ['generator', {
        component: ExpressionField,
        validators: [
            {
                validator: (value) => Boolean(value && value.description),
                message: 'description_is_required',
            },
            {
                validator: (value) => Boolean(value && value.expression),
                message: 'expression_is_required',
            },
        ]
    }],

    ['sampleSkipTest', {
        component: ExpressionField,
        validators: [
            {
                validator: (value) => Boolean(value && value.description),
                message: 'description_is_required',
            },
            {
                validator: (value) => Boolean(value && value.expression),
                message: 'expression_is_required',
            },
        ]
    }],
]);
