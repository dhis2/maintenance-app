import { dispatch } from 'react-redux';

export const SET_APP_LOAD_ERROR = 'SET_APP_LOAD_ERROR';

export const setAppLoadError = (error) => ({
    type: SET_APP_LOAD_ERROR,
    payload: typeof error === "string" ? new Error(error) : error,
    error: true,
});
