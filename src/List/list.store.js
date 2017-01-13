import { getInstance as getD2 } from 'd2/lib/d2';
import { Subject, Observable } from 'rx';
import Store from 'd2-ui/lib/store/Store';
import appState from '../App/appStateStore';

const columnObservable = appState
    .filter(appState => appState.sideBar && appState.sideBar.currentSubSection)
    .map(appState => appState.sideBar.currentSubSection)
    .distinctUntilChanged()
    .map(subSection => {
        if (subSection === 'organisationUnitLevel') {
            return ['displayName', 'level', 'lastUpdated'];
        }

        return ['displayName', 'publicAccess', 'lastUpdated'];
    });

export default Store.create({
    listSourceSubject: new Subject(),

    initialise() {
        this.listSourceSubject
            .concatAll()
            .combineLatest(columnObservable)
            .subscribe(([modelCollection, columns]) => {
                this.setState({
                    tableColumns: columns,
                    pager: modelCollection.pager,
                    list: modelCollection.toArray(),
                });
            });
        return this;
    },

    getNextPage() {
        this.listSourceSubject.onNext(Observable.fromPromise(this.state.pager.getNextPage()));
    },

    getPreviousPage() {
        this.listSourceSubject.onNext(Observable.fromPromise(this.state.pager.getPreviousPage()));
    },
}).initialise();
