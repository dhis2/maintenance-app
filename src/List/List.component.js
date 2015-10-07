import React from 'react';
import {Navigation} from 'react-router';
import classes from 'classnames';
import log from 'loglevel';
import {isIterable} from 'd2-utils';
import DataTable from 'd2-ui/data-table/DataTable.component';
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
import Auth from 'd2-ui/auth/Auth.mixin';

config.i18n.strings.add('management');

function actionsThatRequireCreate(action) {
    if ((action !== 'edit' && action !== 'clone') || this.getCurrentUser().canCreate(this.getModelDefinitionByName(this.props.params.modelType))) {
        return true;
    }
    return false;
}

function actionsThatRequireDelete(action) {
    if (action !== 'delete' || this.getCurrentUser().canDelete(this.getModelDefinitionByName(this.props.params.modelType))) {
        return true;
    }
    return false;
}

function executeLoadListAction(modelType) {
    return listActions.loadList(modelType);
}

function calculatePageValue(pager) {
    const pageSize = 50; // TODO: Make the page size dynamic
    const {total, pageCount, page} = pager;
    const pageCalculationValue = total - (total - ((pageCount - (pageCount - page)) * pageSize));
    const startItem = 1 + pageCalculationValue - pageSize;
    const endItem = pageCalculationValue;

    return `${startItem} - ${endItem > total ? total : endItem}`;
}

const List = React.createClass({
    propTypes: {
        params: React.PropTypes.shape({
            modelType: React.PropTypes.string.isRequired,
        }),
    },

    mixins: [Navigation, ObserverRegistry, Translate, Auth],

    statics: {
        willTransitionTo(transition, params, query, callback) {
            console.log('Loading a list');

            executeLoadListAction(params.modelType)
                .subscribe(
                (message) => { console.info(message); callback(); },
                (message) => {
                    if (/^.+s$/.test(params.modelType)) {
                        const nonPluralAttempt = params.modelType.substring(0, params.modelType.length - 1);
                        log.warn(`Could not find requested model type '${params.modelType}' attempting to redirect to '${nonPluralAttempt}'`);
                        console.log(this);
                        transition.redirect('list', {modelType: nonPluralAttempt});
                        callback();
                    } else {
                        log.error('No clue where', params.modelType, 'comes from... Redirecting to app root');
                        log.error(message);
                        transition.redirect('/');
                        callback();
                    }
                }
            );
        },
    },

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

        const detailsStoreDisposable = detailsStore.subscribe(detailsObject => {
            this.setState({detailsObject});
        });

        this.registerDisposable(sourceStoreDisposable);
        this.registerDisposable(detailsStoreDisposable);
    },

    componentWillReceiveProps(newProps) {
        if (this.props.params.modelType !== newProps.params.modelType) {
            this.setState({
                isLoading: true,
            });
            executeLoadListAction(newProps.params.modelType);
        }
    },

    render() {
        const currentlyShown = calculatePageValue(this.state.pager);

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

        const availableActions = Object.keys(contextActions)
            .filter(actionsThatRequireCreate, this)
            .filter(actionsThatRequireDelete, this)
            .reduce((actions, actionName) => {
                actions[actionName] = contextActions[actionName];
                return actions;
            }, {});

        return (
            <div>
                <h2>{this.getTranslation(`${camelCaseToUnderscores(this.props.params.modelType)}_management`)}</h2>
                <SearchBox searchObserverHandler={this.searchListByName} />
                <LoadingStatus loadingText={['Loading', this.props.params.modelType, 'list...'].join(' ')} isLoading={this.state.isLoading} />
                <ListActionBar modelType={this.props.params.modelType} />
                <Pagination {...paginationProps} />
                <div className={classes('data-table-wrap', {'smaller': !!this.state.detailsObject})}>
                    <DataTable rows={this.state.dataRows} columns={['name']} contextMenuActions={availableActions} contextMenuIcons={{clone: 'content_copy'}} />
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
