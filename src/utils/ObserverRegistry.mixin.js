const ObserverRegistry = {
    componentWillMount() {
        this.observerDisposables = [];
    },

    componentWillUnmount() {
        this.observerDisposables.forEach(disposable => disposable.dispose());
    },

    registerDisposable(disposable) {
        this.observerDisposables.push(disposable);
    },
};

export default ObserverRegistry;
