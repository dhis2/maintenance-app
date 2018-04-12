/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { path } from 'lodash/fp';

import Dropdown from '../../forms/form-fields/drop-down';
import DropdownAsync from '../../forms/form-fields/drop-down-async';
import getConstantDisplayNameOrOld from '../helpers/getConstantDisplayNameOrOld';
import listActions from '../list.actions';

class Filter extends Component {
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


    render() {
        const {
            modelType,
            filterField,
            filters,
        } = this.props;

        const modelDefinition = this.context.d2.models[modelType];

        return (
            <div>
                {this.isConstantField(modelDefinition, filterField)
                    ? (<Dropdown
                        labelText={this.getTranslation(filterField)}
                        options={this.getConstants(modelDefinition, filterField)}
                        onChange={this.makeFilterSetter(filterField)}
                        value={filters ? filters[filterField] : null}
                        translateOptions={filterField !== 'periodType'}
                    />)
                    : (<DropdownAsync
                        labelText={this.getTranslation(filterField)}
                        referenceType={this.getReferenceType(filterField)}
                        onChange={this.makeFilterSetter(filterField)}
                        value={filters ? filters[filterField] : null}
                        quickAddLink={false}
                        preventAutoDefault
                        style={{ display: 'relative' }}
                        limit={1}
                        top={-15}
                    />)}
            </div>
        );
    }
}

Filter.propTypes = {
    setIsLoadingState: PropTypes.func.isRequired,
    filters: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    filterField: PropTypes.string.isRequired,
    modelType: PropTypes.string.isRequired,
};

Filter.defaultProps = { filters: undefined };
Filter.contextTypes = { d2: PropTypes.object.isRequired };

export default Filter;
