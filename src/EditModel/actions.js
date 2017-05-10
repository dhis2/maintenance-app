export const createActionCreator = (type) => (payload) => ({ type, payload });

export const NOTIFY_USER = 'NOTIFY_USER';
export const notifyUser = createActionCreator(NOTIFY_USER);
