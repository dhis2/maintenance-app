import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import { connect } from '../../../../../../Library/Caches/typescript/2.9/node_modules/@types/react-redux';
import { closeColumnsDialog } from './actions';
import { getColumnsForModelType, getDialogOpen } from './selectors';

export class ColumnConfigDialog extends Component {
    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.closeColumnsDialog}
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    open: getDialogOpen,
    columns: getColumnsForModelType(state, ownProps.modelType),
});

const mapDispatchToProps = {
    closeColumnsDialog,
};

ColumnConfigDialog = connect(
    mapStateToProps,
    mapDispatchToProps
)(ColumnConfigDialog);

export default ColumnConfigDialog;
