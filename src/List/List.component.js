import React from 'react';
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
import Heading from 'd2-ui/lib/headings/Heading.component';
import fieldOrder from '../config/field-config/field-order';

// Filters out any actions `edit`, `clone` when the user can not update/edit this modelType
function actionsThatRequireCreate(action) {
    if ((action !== 'edit' && action !== 'clone') || this.getCurrentUser().canUpdate(this.getModelDefinitionByName(this.props.params.modelType))) {
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

function getTranslatablePropertiesForModelType(modelType) {
    const fieldsForModel = fieldOrder.for(modelType);
    const defaultTranslatableProperties = ['name', 'shortName'];

    if (fieldsForModel.indexOf('description') >= 0) {
        defaultTranslatableProperties.push('description');
    }

    switch (modelType) {
    case 'dataElement':
        return defaultTranslatableProperties.concat(['formName']);
    case 'organisationUnitLevel':
        return ['name'];
    default:
        break;
    }

    return defaultTranslatableProperties;
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
        });

        const translationStoreDisposable = translationStore.subscribe(translationState => {
            this.setState({
                translation: translationState,
            });
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
                translation: Object.assign({}, this.state.translation, { open: false }),
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
        case 'edit':
        case 'clone':
            return model.access.write;
        case 'translate':
            return model.access.read && model.modelDefinition.identifiableObject;
        case 'details':
            return model.access.read;
        case 'share':
            return model.modelDefinition.isSharable === true; // TODO: Sharing is filtered out twice...
        case 'dataEntryForm':
            return model.modelDefinition.name === 'dataSet' && model.access.write;
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
                if (actionName === 'share') {
                    return this.context.d2.models[this.props.params.modelType] && this.context.d2.models[this.props.params.modelType].isSharable;
                }
                return true;
            })
            .reduce((actions, actionName) => {
                // TODO: Don't re-assign param?
                actions[actionName] = contextActions[actionName]; // eslint-disable-line no-param-reassign
                return actions;
            }, {});

        const styles = {
            dataTableWrap: {
                display: 'flex',
                flexDirection: 'column',
                flex: 2,
            },

            detailsBoxWrap: {
                flex: 1,
                marginLeft: '1rem',
                marginRight: '1rem',
                opacity: 1,
            },

            listDetailsWrap: {
                flex: 1,
                display: 'flex',
                flexOrientation: 'row',
            },
        };

        const contextMenuIcons = {
            clone: 'content_copy',
            sharing: 'share',
            dataEntryForm: 'assignment',
            pdfDataSetForm: 'picture_as_pdf',
        };

        return (
            <div>
                <div>
                    <Heading>{this.getTranslation(`${camelCaseToUnderscores(this.props.params.modelType)}_management`)}</Heading>
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
                <div style={styles.listDetailsWrap}>
                    <div style={styles.dataTableWrap}>
                        <DataTable
                            rows={this.state.dataRows}
                            columns={this.state.tableColumns}
                            contextMenuActions={availableActions}
                            contextMenuIcons={contextMenuIcons}
                            primaryAction={availableActions.details}
                            isContextActionAllowed={this.isContextActionAllowed}
                        />
                        {this.state.dataRows.length || this.state.isLoading ? null : <div>No results found</div>}
                    </div>
                    {this.state.detailsObject ?
                        <div style={styles.detailsBoxWrap}>
                            <Paper zDepth={1} rounded={false} style={{ position: 'fixed' }}>
                                <DetailsBox source={this.state.detailsObject} showDetailBox={!!this.state.detailsObject}
                                            onClose={listActions.hideDetailsBox} />
                            </Paper>
                        </div>
                    : null}
                </div>
                {this.state.sharing.model ? <SharingDialog
                    objectToShare={this.state.sharing.model}
                    open={this.state.sharing.open && this.state.sharing.model}
                    onRequestClose={this._closeSharingDialog}
                /> : null }
                {this.state.translation.model ? <TranslationDialog
                    objectToTranslate={this.state.translation.model}
                    objectTypeToTranslate={this.state.translation.model && this.state.translation.model.modelDefinition}
                    open={this.state.translation.open}
                    onTranslationSaved={this._translationSaved}
                    onTranslationError={this._translationErrored}
                    onRequestClose={this._closeTranslationDialog}
                    fieldsToTranslate={getTranslatablePropertiesForModelType(this.props.params.modelType)}
                /> : null }
            </div>
        );
    },

    _closeTranslationDialog() {
        translationStore.setState(Object.assign({}, translationStore.state, {
            open: false,
        }));
    },

    _closeSharingDialog() {
        sharingStore.setState(Object.assign({}, sharingStore.state, {
            open: false,
        }));
    }
});

export default List;
