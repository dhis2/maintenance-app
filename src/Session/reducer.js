import { SET_SESSION_EXPIRED } from './actions';

const initialState = {
    expired: false,
};

export default function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SESSION_EXPIRED: {
            return {
                ...state,
                expired: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}
