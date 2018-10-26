import { SET_APP_LOAD_ERROR } from './actions';

const initialState = {
    expired: false,
};

export default function appLoadReducer(state = initialState, action) {
    switch (action.type) {
        case SET_APP_LOAD_ERROR: {
            return {
                ...state,
                error: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}
