import React from 'react';
import {Navigation} from 'react-router';
import classes from 'classnames';
import log from 'loglevel';
import {isIterable} from 'd2-utils';
import DataTable from 'd2-ui-datatable/DataTable.component';
import Pagination from 'd2-ui/pagination/Pagination.component';
import DetailsBox from 'd2-ui-detailsbox/DetailsBox.component';
import Sticky from 'react-sticky';
import contextActions from './ContextActions';
import detailsStore from './details.store';
import listStore from './list.store';
import listActions from './list.actions';
import ObserverRegistry from '../utils/ObserverRegistry.mixin';
import Paper from 'material-ui/lib/paper';
import {config} from 'd2';
import Translate from 'd2-ui/i18n/Translate.mixin';
import ListActionBar from './ListActionBar.component';
import SearchBox from './SearchBox.component';
import LoadingStatus from './LoadingStatus.component';
import {camelCaseToUnderscores} from 'd2-utils';

config.i18n.strings.add('list_for');

const List = React.createClass({
    propTypes: {
        params: React.PropTypes.shape({
            modelType: React.PropTypes.string.isRequired,
        }),
    },

    mixins: [Navigation, ObserverRegistry, Translate],

    getInitialState() {
        return {
            dataRows: [],
            pager: {
                total: 0,
            },
            isLoading: true,
            detailsObject: null,
        };
    },

    componentWillMount() {
        this.executeLoadListAction(this.props.params.modelType);

        const sourceStoreDisposable = listStore
            .subscribe(listStoreValue => {
                if (!isIterable(listStoreValue.list)) {
                    return; // Received value is not iterable, keep waiting
                }

                this.setState({
                    dataRows: listStoreValue.list,
                    pager: listStoreValue.pager,
                    isLoading: false,
                });
            });
        this.registerDisposable(sourceStoreDisposable);

        const detailsStoreDisposable = detailsStore.subscribe(detailsObject => {
            this.setState({detailsObject});
        });

        this.registerDisposable(detailsStoreDisposable);
    },

    componentWillReceiveProps(newProps) {
        if (this.props.params.modelType !== newProps.params.modelType) {
            this.setState({
                isLoading: true,
            });
            this.executeLoadListAction(newProps.params.modelType);
        }
    },

    render() {
        const currentlyShown = `${(this.state.dataRows.length * (this.state.pager.page - 1))} - ${this.state.dataRows.length * this.state.pager.page}`;

        const paginationProps = {
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
            currentlyShown,
        };

        return (
            <div>
                <h2>{this.getTranslation('list_for')} {this.getTranslation(camelCaseToUnderscores(this.props.params.modelType))}</h2>
                <SearchBox searchObserverHandler={this.searchListByName} />
                <LoadingStatus loadingText={['Loading', this.props.params.modelType, 'list...'].join(' ')} isLoading={this.state.isLoading} />
                <ListActionBar modelType={this.props.params.modelType} />
                <Pagination {...paginationProps} />
                <div className={classes('data-table-wrap', {'smaller': !!this.state.detailsObject})}>
                    <DataTable rows={this.state.dataRows} contextMenuActions={contextActions} />
                    {this.state.dataRows.length ? null : <div>No results found</div>}
                </div>
                <div className={classes('details-box-wrap', {'show-as-column': !!this.state.detailsObject})}>
                    <Sticky>
                        <Paper zDepth={1} rounded={false}>
                            <DetailsBox source={this.state.detailsObject} showDetailBox={!!this.state.detailsObject} onClose={listActions.hideDetailsBox} />
                        </Paper>
                    </Sticky>
                </div>
            </div>
        );
    },

    executeLoadListAction(modelType) {
        this.setState({isLoading: true});

        const searchListDisposable = listActions
            .loadList(modelType)
            .subscribe(
            (message) => { console.info(message); },
            (message) => {
                if (/^.+s$/.test(modelType)) {
                    const nonPluralAttempt = modelType.substring(0, modelType.length - 1);
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

    searchListByName(searchObserver) {
        const searchListByNameDisposable = searchObserver
            .subscribe((value) => {
                console.log('Starting search');
                this.setState({
                    isLoading: true,
                });

                listActions.searchByName({modelType: this.props.params.modelType, searchString: value})
                    .subscribe(() => {}, (error) => log.error(error));
            });

        this.registerDisposable(searchListByNameDisposable);
    },
});

export default List;
