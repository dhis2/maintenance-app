import { SNACK_BAR_MESSAGE_SHOW } from './actions';

export default function snackReducer(state = { show: false }, action) {
    switch(action.type) {
        case SNACK_BAR_MESSAGE_SHOW:
            // console.log(action);
            break;
    }

    return state;
}
