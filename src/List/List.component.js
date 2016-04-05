import React from 'react';
import classes from 'classnames';
import log from 'loglevel';
import isIterable from 'd2-utilizr/lib/isIterable';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';
import DetailsBox from './DetailsBox.component';
import contextActions from './ContextActions';
import detailsStore from './details.store';
import listStore from './list.store';
import listActions from './list.actions';
import ObserverRegistry from '../utils/ObserverRegistry.mixin';
import Paper from 'material-ui/lib/paper';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import ListActionBar from './ListActionBar.component';
import SearchBox from './SearchBox.component';
import LoadingStatus from './LoadingStatus.component';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import Auth from 'd2-ui/lib/auth/Auth.mixin';
import SharingDialog from 'd2-ui/lib/sharing/SharingDialog.component';
import sharingStore from './sharing.store';

import translationStore from './translation-dialog/translationStore';
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';
import snackActions from '../Snackbar/snack.actions';

// Filters out any actions `edit`, `clone` or `share` when the user can not update/edit this modelType
function actionsThatRequireCreate(action) {
    if ((action !== 'edit' && action !== 'clone' && action !== 'share') || this.getCurrentUser().canUpdate(this.getModelDefinitionByName(this.props.params.modelType))) {
        return true;
    }
    return false;
}

// Filters out the `delete` when the user can not delete this modelType
function actionsThatRequireDelete(action) {
    if (action !== 'delete' || this.getCurrentUser().canDelete(this.getModelDefinitionByName(this.props.params.modelType))) {
        return true;
    }
    return false;
}

function calculatePageValue(pager) {
    const pageSize = 50; // TODO: Make the page size dynamic
    const { total, pageCount, page } = pager;
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

    mixins: [ObserverRegistry, Translate, Auth],

    getInitialState() {
        return {
            dataRows: [],
            pager: {
                total: 0,
            },
            isLoading: true,
            detailsObject: null,
            sharing: {
                model: null,
                open: false,
            },
            translation: {
                model: null,
                open: false,
            },
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
                    tableColumns: listStoreValue.tableColumns,
                    isLoading: false,
                });
            });

        const detailsStoreDisposable = detailsStore.subscribe(detailsObject => {
            this.setState({ detailsObject });
        });

        const sharingStoreDisposable = sharingStore.subscribe(sharingState => {
            this.setState({
                sharing: sharingState,
            });

            if (this.refs.sharingDialog && this.refs.sharingDialog.refs.sharingDialog) {
                this.refs.sharingDialog.refs.sharingDialog.show();
            }
        });

        const translationStoreDisposable = translationStore.subscribe(translationState => {
            this.setState({
                translation: translationState,
            });

            if (this.refs.translationDialog && this.refs.translationDialog.refs.translationDialog) {
                this.refs.translationDialog.refs.translationDialog.show();
            }
        });

        this.registerDisposable(sourceStoreDisposable);
        this.registerDisposable(detailsStoreDisposable);
        this.registerDisposable(sharingStoreDisposable);
        this.registerDisposable(translationStoreDisposable);
    },

    componentWillReceiveProps(newProps) {
        if (this.props.params.modelType !== newProps.params.modelType) {
            this.setState({
                isLoading: true,
            });
        }
    },

    _translationSaved() {
        snackActions.show({ message: 'translation_saved', action: 'ok', translate: true });
    },

    _translationErrored(errorMessage) {
        log.error(errorMessage);
        snackActions.show({ message: 'translation_save_error', translate: true });
    },

    isContextActionAllowed(model, action) {
        // Don't allow anything if we can't determine the access
        if (!model || !model.access) {
            return false;
        }

        // TODO: Remove categoryOptionCombo available actions hack when this is sorted through the API
        if (model.modelDefinition.name === 'categoryOptionCombo') {
            if (action === 'edit') {
                return model.access.write;
            }

            if (action === 'details') {
                return model.access.read;
            }

            return false;
        }

        // Shortcut for access detection where action names match to access properties
        if (model.access.hasOwnProperty(action)) {
            return model.access[action];
        }

        // Switch action for special cases
        switch (action) {
        case 'share':
        case 'edit':
        case 'clone':
            return model.access.write;
        case 'translate':
            return model.access.read && model.modelDefinition.identifiableObject;
        case 'details':
            return model.access.read;
        case 'pdfDataSetForm':
            return model.modelDefinition.name === 'dataSet' && model.access.read;
        default:
            return true;
        }
    },

    searchListByName(searchObserver) {
        const searchListByNameDisposable = searchObserver
            .subscribe((value) => {
                this.setState({
                    isLoading: true,
                });

                listActions.searchByName({ modelType: this.props.params.modelType, searchString: value })
                    .subscribe(() => {}, (error) => log.error(error));
            });

        this.registerDisposable(searchListByNameDisposable);
    },

    render() {
        const currentlyShown = calculatePageValue(this.state.pager);

        const paginationProps = {
            hasNextPage: () => Boolean(this.state.pager.hasNextPage) && this.state.pager.hasNextPage(),
            hasPreviousPage: () => Boolean(this.state.pager.hasPreviousPage) && this.state.pager.hasPreviousPage(),
            onNextPageClick: () => {
                this.setState({ isLoading: true });
                listActions.getNextPage();
            },
            onPreviousPageClick: () => {
                this.setState({ isLoading: true });
                listActions.getPreviousPage();
            },
            total: this.state.pager.total,
            currentlyShown,
        };

        const availableActions = Object.keys(contextActions)
            .filter(actionsThatRequireCreate, this)
            .filter(actionsThatRequireDelete, this)
            .filter((actionName) => {
                if (actionName === 'sharing') {
                    return this.context.d2.models[this.props.params.modelType] && this.context.d2.models[this.props.params.modelType].isSharable;
                }
                return true;
            })
            .reduce((actions, actionName) => {
                // TODO: Don't re-assign param?
                actions[actionName] = contextActions[actionName]; // eslint-disable-line no-param-reassign
                return actions;
            }, {});

        return (
            <div>
                <div>
                    <h2 style={{ float: 'left' }}>{this.getTranslation(`${camelCaseToUnderscores(this.props.params.modelType)}_management`)}</h2>
                    <ListActionBar modelType={this.props.params.modelType} groupName={this.props.params.groupName} />
                </div>
                <div>
                    <div style={{ float: 'left', width: '50%' }}>
                        <SearchBox searchObserverHandler={this.searchListByName} />
                    </div>
                    <div>
                        <Pagination {...paginationProps} />
                    </div>
                </div>
                <LoadingStatus loadingText={['Loading', this.props.params.modelType, 'list...'].join(' ')} isLoading={this.state.isLoading} />
                <div className="list-details-wrap">
                    <div className={classes('data-table-wrap', { smaller: !!this.state.detailsObject })}>
                        <DataTable
                            rows={this.state.dataRows}
                            columns={this.state.tableColumns}
                            contextMenuActions={availableActions}
                            contextMenuIcons={{ clone: 'content_copy', sharing: 'share', pdfDataSetForm: 'picture_as_pdf' }}
                            primaryAction={availableActions.details}
                            isContextActionAllowed={this.isContextActionAllowed}
                        />
                        {this.state.dataRows.length ? null : <div>No results found</div>}
                    </div>
                    <div className={classes('details-box-wrap', { 'show-as-column': !!this.state.detailsObject })}>
                        <Paper zDepth={1} rounded={false} style={{position: 'fixed'}}>
                            <DetailsBox source={this.state.detailsObject} showDetailBox={!!this.state.detailsObject} onClose={listActions.hideDetailsBox} />
                        </Paper>
                    </div>
                </div>
                {this.state.sharing.model ? <SharingDialog
                    objectToShare={this.state.sharing.model}
                    open={this.state.sharing.open && this.state.sharing.model}
                    ref="sharingDialog"
                /> : null }
                {this.state.translation.model ? <TranslationDialog
                    objectToTranslate={this.state.translation.model}
                    objectTypeToTranslate={this.state.translation.model && this.state.translation.model.modelDefinition}
                    open={this.state.translation.open}
                    ref="translationDialog"
                    onTranslationSaved={this._translationSaved}
                    onTranslationError={this._translationErrored}
                /> : null }
            </div>
        );
    },
});

export default List;
