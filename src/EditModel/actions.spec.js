import * as actions from './actions';

describe('Model to edit actions', () => {
    describe('for notifying users', () => {
        it('should defined the notification constants', () => {
            expect(actions.NOTIFY_USER).to.equal('NOTIFY_USER');
        });

        it('should create a notify user action when calling notifyUser', () => {
            const expectedAction = {
                type: actions.NOTIFY_USER,
                payload: undefined,
            };

            expect(actions.notifyUser()).to.deep.equal(expectedAction);
        });
    });
});
