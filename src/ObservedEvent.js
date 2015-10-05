import {Subject} from 'rx';

export default function ObservedEvent() {
    function subject(value) {
        subject.onNext(value);
    }

    /* eslint-disable guard-for-in */
    for (const key in Subject.prototype) {
        subject[key] = Subject.prototype[key];
    }
    /* eslint-enable guard-for-in */

    Rx.Subject.call(subject);

    return subject;
}
