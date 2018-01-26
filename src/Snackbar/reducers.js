import { SNACK_BAR_MESSAGE_SHOW, SNACK_BAR_MESSAGE_HIDE } from './actions';

const initialSnackState = {
    show: false,
    message: '',
    action: '',
    autoHideDuration: 0,
    onActionTouchTap: null,
    translate: null,
};

export default function snackReducer(state = initialSnackState, action) {
    switch (action.type) {
        case 'NOTIFY_USER':
        case SNACK_BAR_MESSAGE_SHOW: {
            const {
                message,
                action: snackBarAction,
                autoHideDuration,
                onActionTouchTap,
                translate,
            } = action.payload;

            return {
                show: true,
                message,
                action: snackBarAction,
                autoHideDuration,
                onActionTouchTap,
                translate,
            };
        }
        case SNACK_BAR_MESSAGE_HIDE:
            return initialSnackState;
        default:
            break;
    }

    return state;
}
