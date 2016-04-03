import log from 'loglevel';

const ObserverRegistry = {
    componentWillMount() {
        this.observerDisposables = [];
    },

    componentWillUnmount() {
        // log.debug('Disposing: ', this.observerDisposables);
        this.observerDisposables.forEach(disposable => disposable.dispose());
    },

    registerDisposable(disposable) {
        // log.debug('Registered: ', disposable);
        this.observerDisposables.push(disposable);
    },
};

export default ObserverRegistry;
