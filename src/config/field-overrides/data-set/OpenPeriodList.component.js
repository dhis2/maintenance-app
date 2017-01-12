import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper/Paper';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import { Row } from 'd2-ui/lib/layout';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import DateSelect from '../../../forms/form-fields/date-select';
import { compose, withState, withProps, withHandlers } from 'recompose';

function OpenPeriod({ period, startDate, endDate, onChangeStartDate, onChangeEndDate }, {d2}) {
    const periods = ['2016Q1', '2016Q2', '2016Q3', '2016Q4']
        .map((p) => (
            <MenuItem primaryText={p} value={p} />
        ));

    return (
        <Row style={{ boxSizing: 'border-box' }}>
            <SelectField value={period}>
                {periods}
            </SelectField>
            <div style={{ position: 'relative' }}>
                <DateSelect
                    labelText={d2.i18n.getTranslation('start_date')}
                    onChange={onChangeStartDate}
                    value={startDate}
                />
            </div>
            <div style={{ position: 'relative' }}>
                <DateSelect
                    labelText={d2.i18n.getTranslation('end_date')}
                    onChange={onChangeEndDate}
                    value={endDate}
                />
            </div>
        </Row>
    );
};

const OpenPeriodRow = compose(
    withProps(({ startDate }) => ({

    })),
    withState('startDate', 'changeStartDate', undefined),
    withState('endDate', 'changeEndDate', undefined),
    withHandlers({
        onChangeStartDate: ({ changeStartDate }) => (event) => changeStartDate(event.target.value),
        onChangeEndDate: ({ changeEndDate }) => (event) => changeEndDate(event.target.value),
    }),
    addD2Context
)(OpenPeriod);

export function OpenPeriodList({ openPeriods }, { d2 }) {
    console.log(openPeriods);
    const periods = ['2016Q1', '2016Q2', '2016Q3', '2016Q4'].map((p) => (<OpenPeriodRow period={p} />));

    return (
        <Paper>
            {periods}
        </Paper>
    );
}

export default addD2Context(OpenPeriodList);