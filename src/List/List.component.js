import React from 'react';
import {Navigation} from 'react-router';

import log from 'loglevel';

import {isIterable} from 'd2-utils';
import DataTable from 'd2-ui-datatable/DataTable.component';
import Pagination from 'd2-ui-pagination/Pagination.component';

import contextActions from './ContextActions';

import listStore from './list.store';
import listActions from './list.actions';

import ObservedEvents from '../utils/ObservedEvents.mixin';
import ObserverRegistry from '../utils/ObserverRegistry.mixin';

var LoadingStatus = React.createClass({
    getDefaultProps() {
        return {
            isLoading: false,
            loadingText: 'Loading...'
        }
    },

    render() {
        if (!this.props.isLoading) { return null; }

        return (
            <div>{this.props.loadingText}</div>
        );
    }
});

var SearchBox = React.createClass({
    mixins: [ObservedEvents],

    componentDidMount() {
        //TODO: Observer gets registered multiple times. Which results in many calls.
        let searchObserver = this.events.searchList
            .throttle(400)
            .map(event => event && event.target && event.target.value ? event.target.value : '')
            .distinctUntilChanged();

        this.props.searchObserverHandler(searchObserver);
    },

    render() {
        return (
            <div className="search-list-items">
                <input className="search-list-items--input" type="search" onKeyUp={this.createEventObserver('searchList')} placeholder="Search by name (Enter to search)" />
            </div>
        );
    }
});

var List = React.createClass({
    mixins: [Navigation, ObserverRegistry],

    getInitialState() {
        return {
            dataRows: [],
            pager: {
                total: 0
            },
            isLoading: true
        };
    },

    componentWillMount() {
        this.executeLoadListAction(this.props.params.modelType);

        const sourceStoreDisposable = listStore.subscribe(listStoreValue => {
            if (!isIterable(listStoreValue.list)) {
                return; //Received value is not iterable, keep waiting
            }

            this.setState({
                dataRows: listStoreValue.list,
                pager: listStoreValue.pager,
                isLoading: false,
            });
        });

        this.registerDisposable(sourceStoreDisposable);
    },

    executeLoadListAction(modelType) {
        const searchListDisposable = listActions.loadList(modelType)
            .subscribe(
            (message) => { console.info(message); },
            (message) => {
                if (/^.+s$/.test(modelType)) {
                    let nonPluralAttempt = modelType.substring(0, modelType.length - 1);
                    log.warn(`Could not find requested model type '${modelType}' attempting to redirect to '${nonPluralAttempt}'`);
                    this.transitionTo('list', {modelType: nonPluralAttempt});
                } else {
                    log.error('No clue where', modelType, 'comes from... Redirecting to app root');
                    log.error(message);
                    this.transitionTo('/');
                }
            }
        );

        this.registerDisposable(searchListDisposable);
    },

    componentWillReceiveProps(newProps) {
        if (this.props.params.modelType !== newProps.params.modelType) {
            this.setState({
                isLoading: true
            });
            this.executeLoadListAction(newProps.params.modelType);
        }
    },

    searchListByName(searchObserver) {
        const searchListByNameDisposable = searchObserver
            .subscribe((value) => {
                console.log('Starting search');
                this.setState({
                    isLoading: true
                });

                listActions.searchByName({modelType: this.props.params.modelType, searchString: value})
                    .subscribe(() => {}, (error) => log.error(error));
            });

        this.registerDisposable(searchListByNameDisposable);
    },

    render() {
        let currentlyShown = `${(this.state.dataRows.length * (this.state.pager.page - 1))} - ${this.state.dataRows.length * this.state.pager.page}`;

        let paginationProps = {
            hasNextPage: () => Boolean(this.state.pager.hasNextPage) && this.state.pager.hasNextPage(),
            hasPreviousPage: () => Boolean(this.state.pager.hasPreviousPage) && this.state.pager.hasPreviousPage(),
            onNextPageClick: () => {
                this.setState({isLoading: true});
                listActions.getNextPage();
            },
            onPreviousPageClick: () => {
                this.setState({isLoading: true});
                listActions.getPreviousPage();
            },
            total: this.state.pager.total,
            currentlyShown
        };

        return (
            <div>
                <h2>List of {this.props.params.modelType}</h2>
                <SearchBox searchObserverHandler={this.searchListByName} />
                <LoadingStatus loadingText={['Loading', this.props.params.modelType, 'list...'].join(' ')} isLoading={this.state.isLoading} />
                <Pagination {...paginationProps} />
                <DataTable rows={this.state.dataRows} contextMenuActions={contextActions} />
                {this.state.dataRows.length ? null : <div>No results found</div>}
            </div>
        );
    },
});

export default List;
