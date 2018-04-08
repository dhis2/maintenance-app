import React, { Component } from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';

import isIterable from 'd2-utilizr/lib/isIterable';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';

import Pagination from 'd2-ui/lib/pagination/Pagination.component';
import SharingDialog from 'd2-ui/lib/sharing/SharingDialog.component';
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';
import Heading from 'd2-ui/lib/headings/Heading.component';

import SearchAndFilters from './search-and-filters/SearchAndFilters.component';
import DetailsBoxWithScroll from './details-box/DetailsBoxWithScroll.component';
import LoadingStatus from './LoadingStatus.component';
import HelpLink from './HelpLink.component';
import PredictorDialog from './predictor-dialog/PredictorDialog.component';
import AddButton from './add-button/AddButton.component';
import ListDataTable from './list-data-table/ListDataTable.component';
import CompulsoryDataElementOperandDialog from
    './compulsory-data-elements-dialog/CompulsoryDataElementOperandDialog.component';

import snackActions from '../Snackbar/snack.actions';
import detailsStore from './details-box/details.store';
import listStore from './list.store';
import listActions from './list.actions';
import sharingStore from './sharing.store';
import translationStore from './translation-dialog/translationStore';
import dataElementOperandStore from './compulsory-data-elements-dialog/compulsoryDataElementStore';
import predictorDialogStore from './predictor-dialog/predictorDialogStore';

import fieldOrder from '../config/field-config/field-order';
import { calculatePageValue } from './helpers/pagination';

import './listValueRenderers';

const styles = {
    detailsBoxWrap: {
        flex: 1,
        marginLeft: '1rem',
        marginRight: '1rem',
        opacity: 1,
        flexGrow: 0,
    },
    dataTableAndDetailsWrap: {
        flex: 1,
        display: 'flex',
        flexOrientation: 'row',
    },
    bottomPagination: {
        marginTop: '-2rem',
        paddingBottom: '0.5rem',
    },
};

export function getTranslatablePropertiesForModelType(modelType) {
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

class List extends Component {
    state = {
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
    }

    componentWillMount() {
        this.observerDisposables = [];

        const sourceStoreDisposable = listStore
            .subscribe((listStoreValue) => {
                if (!isIterable(listStoreValue.list)) {
                    return; // Received value is not iterable, keep waiting
                }
                listActions.hideDetailsBox();
                this.setState({
                    dataRows: listStoreValue.list,
                    pager: listStoreValue.pager,
                    tableColumns: listStoreValue.tableColumns,
                    filters: listStoreValue.filters,
                    isLoading: false,
                });
            });

        const detailsStoreDisposable = detailsStore.subscribe((detailsObject) => {
            this.setState({ detailsObject });
        });

        const sharingStoreDisposable = sharingStore.subscribe((sharingState) => {
            this.setState(state => ({
                sharing: sharingState,
                dataRows: state.dataRows.map((row) => {
                    if (row.id === sharingState.model.id) {
                        return {
                            ...row,
                            ...{ publicAccess: sharingState.model.publicAccess },
                        };
                    }
                    return row;
                }),
            }));
        });

        const translationStoreDisposable = translationStore.subscribe((translationState) => {
            this.setState({
                translation: translationState,
            });
        });

        const dataElementOperandStoreDisposable = dataElementOperandStore.subscribe((state) => {
            this.setState({
                dataElementOperand: state,
            });
        });

        const predictorDialogStoreDisposable = predictorDialogStore.subscribe((state) => {
            this.setState({ predictorDialog: state });
        });

        this.registerDisposable(sourceStoreDisposable);
        this.registerDisposable(detailsStoreDisposable);
        this.registerDisposable(sharingStoreDisposable);
        this.registerDisposable(translationStoreDisposable);
        this.registerDisposable(dataElementOperandStoreDisposable);
        this.registerDisposable(predictorDialogStoreDisposable);
    }

    // For some reason the component does not ever fire this function
    componentWillReceiveProps(newProps) {
        if (this.props.params.modelType !== newProps.params.modelType) {
            this.setState({
                isLoading: true,
                detailsObject: null,
                translation: { ...this.state.translation, ...{ open: false } },
            });
        }
    }

    componentWillUnmount() {
        this.observerDisposables.forEach(disposable => disposable.unsubscribe());
    }

    setIsLoadingState = () => this.setState({ isLoading: true });

    setSearchListDisposable = searchListByNameDisposable =>
        this.registerDisposable(searchListByNameDisposable)

    getTranslation = key => this.context.d2.i18n.getTranslation(key);

    registerDisposable = disposable => this.observerDisposables.push(disposable);

    translationSaved = () => {
        snackActions.show({ message: 'translation_saved', translate: true });
    }

    translationError = (errorMessage) => {
        log.error(errorMessage);
        snackActions.show({ message: 'translation_save_error', action: 'ok', translate: true });
    }

    closeTranslationDialog = () => {
        translationStore.setState({
            ...translationStore.state,
            ...{ open: false },
        });
    }

    closeSharingDialog = (sharingState) => {
        const model = sharingState
            ? { ...sharingStore.state.model, ...{ publicAccess: sharingState.publicAccess } }
            : sharingStore.state.model;

        sharingStore.setState({
            ...sharingStore.state,
            ...{ model, open: false },
        });
    }

    closeDataElementOperandDialog = () => {
        dataElementOperandStore.setState({ ...dataElementOperandStore.state, ...{ open: false } });
    }

    render() {
        const currentlyShown = calculatePageValue(this.state.pager);

        const paginationProps = {
            hasNextPage: () => Boolean(this.state.pager.hasNextPage) && this.state.pager.hasNextPage(),
            hasPreviousPage: () => Boolean(this.state.pager.hasPreviousPage) && this.state.pager.hasPreviousPage(),
            onNextPageClick: () => {
                this.setIsLoadingState();
                listActions.getNextPage();
            },
            onPreviousPageClick: () => {
                this.setIsLoadingState();
                listActions.getPreviousPage();
            },
            total: this.state.pager.total,
            currentlyShown,
        };

        return (
            <div>
                <Heading>
                    {this.getTranslation(`${camelCaseToUnderscores(this.props.params.modelType)}_management`)}
                    <HelpLink schema={this.props.params.modelType} />
                </Heading>

                <SearchAndFilters
                    filters={this.state.filters}
                    paginationProps={paginationProps}
                    modelType={this.props.params.modelType}
                    setIsLoadingState={this.setIsLoadingState}
                    setSearchListDisposable={this.setSearchListDisposable}
                />

                <LoadingStatus
                    loadingText={['Loading', this.props.params.modelType, 'list...'].join(' ')}
                    isLoading={this.state.isLoading}
                />

                {this.state.isLoading
                    ? (<div>Loading...</div>)
                    : (
                        <div style={styles.dataTableAndDetailsWrap}>
                            <ListDataTable
                                modelType={this.props.params.modelType}
                                dataRows={this.state.dataRows}
                                tableColumns={this.state.tableColumns}
                            />
                            {!!this.state.detailsObject &&
                                <DetailsBoxWithScroll
                                    style={styles.detailsBoxWrap}
                                    detailsObject={this.state.detailsObject}
                                    onClose={listActions.hideDetailsBox}
                                />}
                        </div>
                    )
                }

                {!!this.state.sharing.model &&
                    <SharingDialog
                        id={this.state.sharing.model.id}
                        type={this.props.params.modelType}
                        open={this.state.sharing.open}
                        onRequestClose={this.closeSharingDialog}
                        bodyStyle={{ minHeight: '400px' }}
                    />}

                {!!this.state.translation.model &&
                    <TranslationDialog
                        objectToTranslate={this.state.translation.model}
                        objectTypeToTranslate={this.state.translation.model.modelDefinition}
                        open={this.state.translation.open}
                        onTranslationSaved={this.translationSaved}
                        onTranslationError={this.translationError}
                        onRequestClose={this.closeTranslationDialog}
                        fieldsToTranslate={getTranslatablePropertiesForModelType(this.props.params.modelType)}
                    />}

                <CompulsoryDataElementOperandDialog
                    model={this.state.dataElementOperand.model}
                    dataElementOperands={this.state.dataElementOperand.dataElementOperands}
                    open={this.state.dataElementOperand.open}
                    onRequestClose={this.closeDataElementOperandDialog}
                />

                {this.state.predictorDialog && <PredictorDialog />}

                <AddButton
                    modelType={this.props.params.modelType}
                    groupName={this.props.params.groupName}
                />

                {(!!this.state.dataRows && !!this.state.dataRows.length) &&
                (<div style={styles.bottomPagination}>
                    <Pagination {...paginationProps} />
                </div>)}
            </div>
        );
    }
}

List.propTypes = {
    params: PropTypes.shape({
        modelType: PropTypes.string.isRequired,
        groupName: PropTypes.string.isRequired,
    }).isRequired,
};

List.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default List;
