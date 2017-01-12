import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import Dialog from 'material-ui/Dialog/Dialog';
import { compose, withState, withProps } from 'recompose';
import OpenPeriodList from './OpenPeriodList.component';

export function DataInputPeriods({ isOpen, openDialog, closeDialog, value }) {
    return (
        <div>
            <RaisedButton onClick={openDialog}>
                <Translate>data_input_periods</Translate>
            </RaisedButton>
            <Dialog
                actions={[
                    <RaisedButton onClick={closeDialog}><Translate>close</Translate></RaisedButton>
                ]}
                open={isOpen} 
                onRequestClose={closeDialog}
                modal
            >
                <OpenPeriodList openPeriods={value} />
            </Dialog>
        </div>
    );
}

const enhance = compose(
    withState('isOpen', 'setIsOpen', false),
    withProps(({ setIsOpen }) => ({
        closeDialog: () => setIsOpen(false),
        openDialog: () => setIsOpen(true),
    }))
);

export default enhance(DataInputPeriods);
