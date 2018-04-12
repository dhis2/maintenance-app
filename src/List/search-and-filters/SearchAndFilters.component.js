/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';

import Pagination from 'd2-ui/lib/pagination/Pagination.component';
import SearchBox from './SearchBox.component';
import Filter from './Filter.component';

import { getFilterFieldsForType } from '../../config/maintenance-models';
import listActions from '../list.actions';

const styles = {
    box: {
        display: 'inline-block',
        marginRight: 16,
        width: 256,
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

    render() {
        const Filters = getFilterFieldsForType(this.props.modelType)
            .map(filterField =>
                (<div key={filterField} style={styles.box}>
                    <Filter
                        filters={this.props.filters}
                        filterField={filterField}
                        setIsLoadingState={this.props.setIsLoadingState}
                        modelType={this.props.modelType}
                    />
                </div>),
            );

        return (
            <div style={styles.searchAndFilterWrap}>
                <div style={styles.topPagination}>
                    <Pagination {...this.props.paginationProps} />
                </div>

                <div>
                    <SearchBox searchObserverHandler={this.searchListByName} />
                    {Filters}
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
SearchAndFilters.defaultProps = { filters: undefined };

export default SearchAndFilters;
