import { PropTypes } from 'react';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import mapProps from 'recompose/mapProps';
import DeleteDialog from './DeleteDialog';

const enhance = compose(
    getContext({ d2: PropTypes.object }),
    mapProps(({ d2, name, ...props }) => ({
        t: d2.i18n.getTranslation.bind(d2.i18n),
        question: `${d2.i18n.getTranslation('delete')} ${name}?`,
        ...props,
    }))
);

const EventProgramStageNotificationDeleteDialog = enhance(DeleteDialog);

export default EventProgramStageNotificationDeleteDialog;
