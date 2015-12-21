import {getInstance as getD2}  from 'd2/lib/d2';
import React from 'react';
import modelToEditStore from '../modelToEditStore';
import FormFields from '../../BasicFields/FormFields.component';
import ReactSelect from 'react-select';

const rejectWhenGroupSetIs = (dataElementGroupSetId) => (dataElementGroup) => dataElementGroup.dataElementGroupSet && dataElementGroup.dataElementGroupSet.id !== dataElementGroupSetId;
const getObjectWithId = (objectsWithIds, id) => objectsWithIds.reduce((result, objectsWithId) => (objectsWithId.id === id ? objectsWithId : result), undefined);

const DataElementGroupsFields = React.createClass({
    propTypes: {
        model: React.PropTypes.shape({
            dataElementGroups: React.PropTypes.array.isRequired,
        }).isRequired,
    },

    getInitialState() {
        return {};
    },

    componentWillMount() {
        getD2().then(d2 => {
            d2.models.dataElementGroupSet
                .list({paging: false, fields: 'id,name,displayName,dataElementGroups[id,name,displayName]'})
                .then(dataElementGroupSetsCollection => dataElementGroupSetsCollection.toArray())
                .then(dataElementGroupSets => this.setState({dataElementGroupSets}));
        });
    },

    render() {
        function getSelectedValue(dataElementGroups, dataElementGroupSet) {
            if (!Array.isArray(dataElementGroups)) {
                return undefined;
            }

            return dataElementGroups
                .filter(dataElementGroup => dataElementGroup.dataElementGroupSet && dataElementGroup.dataElementGroupSet.id === dataElementGroupSet.id)
                .reduce((selectBoxValue, dataElementGroup) => {
                    if (dataElementGroup && dataElementGroup.id) {
                        return dataElementGroup.id;
                    }
                }, undefined);
        }

        if (!Array.isArray(this.state.dataElementGroupSets)) {
            return (<div>Loading data element group sets..</div>);
        }

        return (
            <FormFields>
                {this.state.dataElementGroupSets.map(dataElementGroupSet => {
                    const reactSelectProps = {
                        name: dataElementGroupSet.name,
                        options: dataElementGroupSet.dataElementGroups.map(dataElementGroup => {
                            return {label: dataElementGroup.displayName, value: dataElementGroup.id};
                        }),
                        value: getSelectedValue(this.props.model.dataElementGroups, dataElementGroupSet),
                        onChange: function onChange(value) {
                            const dataElementGroupToAdd = getObjectWithId(dataElementGroupSet.dataElementGroups, value);
                            const newDataElementGroups = (this.props.model.dataElementGroups || [])
                                .filter(rejectWhenGroupSetIs(dataElementGroupSet.id));

                            if (dataElementGroupToAdd) {
                                dataElementGroupToAdd.dataElementGroupSet = {id: dataElementGroupSet.id};
                                newDataElementGroups.push(dataElementGroupToAdd);
                            }

                            // TODO: Changing props is bad practice.. (Should ideally create a new model from data and set that, think `Model.clone();`)
                            this.props.model.dataElementGroups = newDataElementGroups;
                            modelToEditStore.setState(this.props.model);
                        }.bind(this),
                    };

                    return (
                        <div className="d2-input input-field" key={dataElementGroupSet.id}>
                            <label className="active" htmlFor={dataElementGroupSet.id}>{dataElementGroupSet.displayName}</label>
                            <div className="d2-select">
                                <ReactSelect {...reactSelectProps} />
                            </div>
                        </div>
                    );
                })}
            </FormFields>
        );
    },
});

export default DataElementGroupsFields;
