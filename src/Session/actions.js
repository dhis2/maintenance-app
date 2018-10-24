import { dispatch } from 'react-redux';

export const SET_SESSION_EXPIRED = 'SET_SESSION_EXPIRED';

export const setSessionExpired = (expired = true) => ({
    type: SET_SESSION_EXPIRED,
    payload: expired,
});
