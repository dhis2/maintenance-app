/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { path } from 'lodash/fp';
import log from 'loglevel';

import Pagination from 'd2-ui/lib/pagination/Pagination.component';
import SearchBox from './SearchBox.component';
import Dropdown from '../../forms/form-fields/drop-down';
import DropdownAsync from '../../forms/form-fields/drop-down-async';

import { getFilterFieldsForType } from '../../config/maintenance-models';
import getConstantDisplayNameOrOld from '../helpers/getConstantDisplayNameOrOld';
import listActions from '../list.actions';

const styles = {
    box: {
        display: 'inline-block',
        marginRight: 16,
        width: 256,
    },
    filtersDropDownAsync: {
        display: 'relative',
    },
    searchAndFilterWrap: {
        clear: 'both',
        minHeight: 80,
    },
    topPagination: {
        float: 'right',
    },
};

class SearchAndFilters extends Component {
    getTranslation = key => this.context.d2.i18n.getTranslation(key);

    getReferenceType = filterField => (
        this.context.d2.models.hasOwnProperty(filterField)
            ? filterField
            : `${this.props.modelType}.${filterField}`
    )

    getConstants = (modelDefinition, filterField) => (
        modelDefinition.modelProperties[filterField].constants.map(c =>
            ({
                text: getConstantDisplayNameOrOld(this.props.modelType, filterField, c),
                value: c,
            }))
    )

    searchListByName = (searchObserver) => {
        const searchListByNameDisposable = searchObserver
            .subscribe((value) => {
                this.props.setIsLoadingState();

                listActions.searchByName({
                    modelType: this.props.modelType,
                    searchString: value,
                }).subscribe(() => {}, error => log.error(error));
            });
        this.props.setSearchListDisposable(searchListByNameDisposable);
    }

    makeFilterSetter = filterField => (e) => {
        this.props.setIsLoadingState();

        listActions.setFilterValue({
            filterField,
            filterValue: e.target.value,
            modelType: this.props.modelType,
        });
    };

    isConstantField = (modelDefinition, filterField) =>
        path(`${filterField}.constants`, modelDefinition.modelProperties)

    renderFilters = (filterField) => {
        const modelDefinition = this.context.d2.models[this.props.modelType];

        return (
            <div key={filterField} style={styles.box}>
                {this.isConstantField(modelDefinition, filterField)
                    ? (<Dropdown
                        labelText={this.getTranslation(filterField)}
                        options={this.getConstants(modelDefinition, filterField)}
                        onChange={this.makeFilterSetter(filterField)}
                        value={this.props.filters ? this.props.filters[filterField] : null}
                        translateOptions={filterField !== 'periodType'}
                    />)
                    : (<DropdownAsync
                        labelText={this.getTranslation(filterField)}
                        referenceType={this.getReferenceType(filterField)}
                        onChange={this.makeFilterSetter(filterField)}
                        value={this.props.filters ? this.props.filters[filterField] : null}
                        quickAddLink={false}
                        preventAutoDefault
                        style={styles.filterDrowDownAsync}
                        limit={1}
                        top={-15}
                    />)
                }
            </div>
        );
    }


    render() {
        return (
            <div style={styles.searchAndFilterWrap}>
                <div style={styles.topPagination}>
                    <Pagination {...this.props.paginationProps} />
                </div>
                <div>
                    <SearchBox searchObserverHandler={this.searchListByName} />
                    {getFilterFieldsForType(this.props.modelType)
                        .map(filterField => this.renderFilters(filterField))}
                </div>
            </div>
        );
    }
}

SearchAndFilters.propTypes = {
    setIsLoadingState: PropTypes.func.isRequired,
    setSearchListDisposable: PropTypes.func.isRequired,
    modelType: PropTypes.string.isRequired,
    paginationProps: PropTypes.object.isRequired,
    filters: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
};

SearchAndFilters.defaultProps = {
    filters: undefined,
};

SearchAndFilters.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default SearchAndFilters;
