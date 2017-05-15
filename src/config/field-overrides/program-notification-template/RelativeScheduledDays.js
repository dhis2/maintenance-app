import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import getContext from 'recompose/getContext';
import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

const relativeScheduledDaysStyle = {
    wrap: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
};

const enhance = compose(
    getContext({ d2: PropTypes.object }),
    withState('beforeOrAfter', 'setBeforeOrAfter', ({ value }) => value >= 0 ? 'after' : 'before'),
    withHandlers({
        onChangeBeforeAfter: ({ onChange, setBeforeOrAfter, value }) => (event, index, beforeOrAfter) => {
            const days = beforeOrAfter === 'after' ? Number(value) : -1 * Number(value);
            setBeforeOrAfter(beforeOrAfter);

            onChange({ target: { value: days } });
        },
        onChangeDays: ({ onChange, beforeOrAfter }) => (event, value) => {
            const days = beforeOrAfter === 'after' ? Number(value) : -1 * Number(value);

            if (!Number.isNaN(days)) {
                onChange({ target: { value: days } });
            }
        },
    })
);

function RelativeScheduledDays({ onChangeBeforeAfter, beforeOrAfter, onChangeDays, d2, value }) {
    const t = d2.i18n.getTranslation.bind(d2.i18n);

    return (
        <div style={relativeScheduledDaysStyle.wrap}>
            <span>{t('send_notification')}</span>
            <TextField
                hintText={t('number_of_days')}
                value={Math.abs(value)}
                onChange={onChangeDays}
            />
            <span>{t('days')}</span>
            <SelectField value={beforeOrAfter} onChange={onChangeBeforeAfter}>
                <MenuItem value="before" primaryText={t('before')} />
                <MenuItem value="after" primaryText={t('after')} />
            </SelectField>
            <span>{t('scheduled_date')}</span>
        </div>
    );
}

export default enhance(RelativeScheduledDays);
