import React, { Component } from 'react';
import DownloadObjectDialog from './DownloadObjectDialog';
import { connect } from 'react-redux';
import {
    getDialogType,
    getDialogProps,
    getDialogIsOpen,
} from '../dialog/selectors';
import { closeDialog } from '../dialog/actions';
import * as DIALOGTYPES from '../dialog/types';

const DialogComponents = {
    [DIALOGTYPES.DOWNLOAD_OBJECT]: DownloadObjectDialog,
};

export class ListDialogs extends Component {
    state = {
        openDialog: null,
    };

    render() {
        const { open, dialogType, dialogProps } = this.props;
        if (!open) {
            return null;
        }
        const DialogType = DialogComponents[dialogType];
        return DialogType ? (
            <DialogType
                {...{ ...this.props, ...dialogProps }}
                open={true}
            />
        ) : null;
    }
}

const mapStateToProps = state => ({
    dialogType: getDialogType(state),
    open: getDialogIsOpen(state),
    dialogProps: getDialogProps(state),
});

const mapDispatchToProps = {
    defaultCloseDialog: closeDialog,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListDialogs);
