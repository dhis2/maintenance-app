'use strict';

import React from 'react';
import {Subject, Observable} from 'rx/dist/rx.all';

import log from 'loglevel';

const ObserverRegistry = {
    observerDisposables: [],

    componentWillUnmount() {
        log.info('Disposing: ', this.observerDisposables);
        this.observerDisposables.forEach(disposable => disposable.dispose());
    },

    registerDisposable(disposable) {
        log.info('Registered: ', disposable);
        this.observerDisposables.push(disposable);
    }
};

export default ObserverRegistry;
