import log from 'loglevel';

const ObserverRegistry = {
    componentWillMount() {
        this.observerDisposables = [];
    },

    componentWillUnmount() {
        log.info('Disposing: ', this.observerDisposables);
        this.observerDisposables.forEach(disposable => disposable.dispose());
    },

    registerDisposable(disposable) {
        log.info('Registered: ', disposable);
        this.observerDisposables.push(disposable);
    },
};

export default ObserverRegistry;
