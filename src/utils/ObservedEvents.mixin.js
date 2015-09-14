'use strict';

import React from 'react';
import {Subject, Observable} from 'rx/dist/rx.all';

import log from 'loglevel';

let ObservedEvents = {
    getInitialState() {
        this.events = {};
        this.eventSubjects = {};

        return {};
    },

    createEventObserver: function () {
        let subjectMap = new Map();

        return function (referenceName) {
            let subject;

            if (!subjectMap.has(referenceName)) {
                subject = new Subject();
                subjectMap.set(referenceName, subject);
            } else {
                subject = subjectMap.get(referenceName);
            }

            if (!this.events[referenceName]) {
                //Run a map that keeps a copy of the event
                this.events[referenceName] = subject.map(event => { return Object.assign({}, event); });
            }

            return (event) => {
                subject.onNext(event);
            }
        };
    }(),

    componentWillUnmount() {
        //Complete any eventsSubjects
        Object.keys(this.eventSubjects).forEach(eventSubjectKey => {
            log.info('Completing: ' + this.constructor.name + '.' + eventSubjectKey);
            this.eventSubjects[eventSubjectKey].onCompleted();
        });
    }
};

export default ObservedEvents;
