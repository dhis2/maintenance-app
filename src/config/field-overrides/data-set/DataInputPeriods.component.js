import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import Dialog from 'material-ui/Dialog/Dialog';
import { compose, withState, withProps } from 'recompose';
import OpenPeriodList from './OpenPeriodList.component';

const styles = {
    buttonLabel: {
        padding: '0 1rem',
    },
    dialog: {
        maxWidth: '900px',
    },
};

export function DataInputPeriods({ isOpen, openDialog, closeDialog, value, periodType }) {
    return (
        <div>
            <RaisedButton onClick={openDialog} label={<Translate>data_input_periods</Translate>} />
            <Dialog
                title={<Heading><Translate>data_input_periods</Translate></Heading>}
                actions={[
                    <RaisedButton
                        onClick={closeDialog}
                        label={<Translate>close</Translate>}
                    />
                ]}
                open={isOpen} 
                onRequestClose={closeDialog}
                contentStyle={styles.dialog}
                modal
            >
                <OpenPeriodList
                    openPeriods={value}
                    periodType={periodType}
                />
            </Dialog>
        </div>
    );
}

const enhance = compose(
    withState('isOpen', 'setIsOpen', false),
    withProps(({ setIsOpen, model }) => ({
        closeDialog: () => setIsOpen(false),
        openDialog: () => setIsOpen(true),
        periodType: model.periodType,
    }))
);

export default enhance(DataInputPeriods);
