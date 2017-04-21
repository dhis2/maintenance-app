import React, { Component } from 'react';
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
import Paper from 'material-ui/Paper/Paper';
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
import dataElementOperandStore from './compulsory-data-elements-dialog/compulsoryDataElementStore';
import CompulsoryDataElementOperandDialog from './compulsory-data-elements-dialog/CompulsoryDataElementOperandDialog.component';
import predictorDialogStore from './predictor-dialog/predictorDialogStore';
import PredictorDialog from './predictor-dialog/PredictorDialog.component';
import snackActions from '../Snackbar/snack.actions';
import Heading from 'd2-ui/lib/headings/Heading.component';
import fieldOrder from '../config/field-config/field-order';
import { Observable } from 'rx';
import { calculatePageValue } from './helpers/pagination';
import HelpLink from './HelpLink.component';

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

class DetailsBoxWithScroll extends Component {

    componentDidMount() {
        this.disposable = Observable
            .fromEvent(global, 'scroll')
            .debounce(200)
            .map(() => document.querySelector('body').scrollTop)
            .subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    }

    render() {
        return (
            <div style={this.props.style}>
                <Paper zDepth={1} rounded={false} style={{ maxWidth: 500, minWidth: 300, marginTop: document.querySelector('body').scrollTop }}>
                    <DetailsBox
                        source={this.props.detailsObject}
                        showDetailBox={!!this.props.detailsObject}
                        onClose={this.props.onClose}
                    />
                </Paper>
            </div>
        );
    }
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
            orgunitassignment: {
                model: null,
                open: false,
            },
            dataElementOperand: {
                model: null,
                open: false,
            },
            predictorDialog: {
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
            this.setState(state => ({
                sharing: sharingState,
                dataRows: state.dataRows.map(row => {
                    if (row.id === sharingState.model.id) {
                        return Object.assign(row, { publicAccess: sharingState.model.publicAccess });
                    }
                    return row;
                }),
            }));
        });

        const translationStoreDisposable = translationStore.subscribe(translationState => {
            this.setState({
                translation: translationState,
            });
        });

        const dataElementOperandStoreDisposable = dataElementOperandStore.subscribe(state => {
            this.setState({
                dataElementOperand: state,
            });
        });

        const predictorDialogStoreDisposable = predictorDialogStore.subscribe(state => {
            this.setState({ predictorDialog: state });
        });

        this.registerDisposable(sourceStoreDisposable);
        this.registerDisposable(detailsStoreDisposable);
        this.registerDisposable(sharingStoreDisposable);
        this.registerDisposable(translationStoreDisposable);
        this.registerDisposable(dataElementOperandStoreDisposable);
        this.registerDisposable(predictorDialogStoreDisposable);
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
        snackActions.show({ message: 'translation_saved', translate: true });
    },

    _translationError(errorMessage) {
        log.error(errorMessage);
        snackActions.show({ message: 'translation_save_error', action: 'ok', translate: true });
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

        if (action === 'runNow' && model.modelDefinition.name === 'predictor') {
            return this.context.d2.currentUser.authorities.has('F_PREDICTOR_RUN');
        }

        // Switch action for special cases
        switch (action) {
        case 'edit':
            return model.access.write;
        case 'clone':
            return model.modelDefinition.name !== 'dataSet' && model.access.write;
        case 'translate':
            return model.access.read && model.modelDefinition.identifiableObject;
        case 'details':
            return model.access.read;
        case 'share':
            return model.modelDefinition.isShareable === true; // TODO: Sharing is filtered out twice...
        case 'delete':
            return model.access.delete;
        case 'compulsoryDataElements':
            return model.modelDefinition.name === 'dataSet' && model.access.write;
        case 'sectionForm':
            return model.modelDefinition.name === 'dataSet' && model.access.write;
        case 'dataEntryForm':
            return model.modelDefinition.name === 'dataSet' && model.access.write;
        case 'pdfDataSetForm':
            return model.modelDefinition.name === 'dataSet' && model.access.read;
        case 'runNow':
            return model.modelDefinition.name === 'pushAnalysis' && model.access.write;
        case 'preview':
            return model.modelDefinition.name === 'pushAnalysis' && model.access.write;
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
            // Disable filtering on actions that require create authorities
            // Editing is also allowed when the object is shared with you even when you do not have the authority to edit that type of object
            // This is therefore disabled in 2.25 and 2.26 (It should be fixed in 2.27, where it'd require both)
            // .filter(actionsThatRequireCreate, this)
            // Same goes for delete
            // .filter(actionsThatRequireDelete, this)
            .filter((actionName) => {
                if (actionName === 'share') {
                    return this.context.d2.models[this.props.params.modelType] && this.context.d2.models[this.props.params.modelType].isShareable;
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
                flexGrow: 0,
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
            sectionForm: 'assignment_turned_in',
            dataEntryForm: 'assignment',
            pdfDataSetForm: 'picture_as_pdf',
            compulsoryDataElements: 'border_color',
            runNow: 'queue_play_next',
            preview: 'dashboard',
        };

        return (
            <div>
                <div>
                    <Heading>{this.getTranslation(`${camelCaseToUnderscores(this.props.params.modelType)}_management`)}<HelpLink schema={this.props.params.modelType} /></Heading>
                    <ListActionBar modelType={this.props.params.modelType} groupName={this.props.params.groupName} />
                </div>
                <div>
                    <div style={{ float: 'left', width: '50%' }}>
                        <SearchBox searchObserverHandler={this.searchListByName}/>
                    </div>
                    <div>
                        <Pagination {...paginationProps} />
                    </div>
                </div>
                <LoadingStatus
                    loadingText={['Loading', this.props.params.modelType, 'list...'].join(' ')}
                    isLoading={this.state.isLoading}
                />
                <div style={styles.listDetailsWrap}>
                    <div style={styles.dataTableWrap}>
                        <DataTable
                            rows={this.state.dataRows}
                            columns={this.state.tableColumns}
                            contextMenuActions={availableActions}
                            contextMenuIcons={contextMenuIcons}
                            primaryAction={(model) => availableActions.edit(model)}
                            isContextActionAllowed={this.isContextActionAllowed}
                        />
                        {this.state.dataRows.length || this.state.isLoading ? null : <div>No results found</div>}
                    </div>
                    {
                        this.state.detailsObject ?
                            <DetailsBoxWithScroll
                                style={styles.detailsBoxWrap}
                                detailsObject={this.state.detailsObject}
                                onClose={listActions.hideDetailsBox}
                            />
                        : null}
                </div>
                <div style={{ marginTop: '-2rem', paddingBottom: '0.5rem' }}>
                    <Pagination {...paginationProps} />
                </div>
                {this.state.sharing.model ? <SharingDialog
                    objectToShare={this.state.sharing.model}
                    open={this.state.sharing.open && this.state.sharing.model}
                    onRequestClose={this._closeSharingDialog}
                    bodyStyle={{ minHeight: '400px' }}
                /> : null }
                {this.state.translation.model ? <TranslationDialog
                    objectToTranslate={this.state.translation.model}
                    objectTypeToTranslate={this.state.translation.model && this.state.translation.model.modelDefinition}
                    open={this.state.translation.open}
                    onTranslationSaved={this._translationSaved}
                    onTranslationError={this._translationError}
                    onRequestClose={this._closeTranslationDialog}
                    fieldsToTranslate={getTranslatablePropertiesForModelType(this.props.params.modelType)}
                /> : null }
                <CompulsoryDataElementOperandDialog
                    model={this.state.dataElementOperand.model}
                    dataElementOperands={this.state.dataElementOperand.dataElementOperands}
                    open={this.state.dataElementOperand.open}
                    onRequestClose={this._closeDataElementOperandDialog}
                />
                {this.state.predictorDialog && <PredictorDialog />}
            </div>
        );
    },

    _closeTranslationDialog() {
        translationStore.setState(Object.assign({}, translationStore.state, {
            open: false,
        }));
    },

    _closeSharingDialog(sharingState) {
        const model = sharingState
            ? Object.assign(sharingStore.state.model, { publicAccess: sharingState.publicAccess })
            : sharingStore.state.model;
        sharingStore.setState(Object.assign({}, sharingStore.state, {
            model,
            open: false,
        }));
    },

    _closeDataElementOperandDialog() {
        dataElementOperandStore.setState(Object.assign({}, dataElementOperandStore.state, {
            open: false,
        }));
    },
});

export default List;
