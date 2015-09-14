import d2 from '../../utils/d2';
import React from 'react';
import modelToEditStore from '../modelToEditStrore';
import objectActions from '../objectActions';

import FormFields from 'd2-ui-basicfields/FormFields.component';
import ReactSelect from 'react-select';

const rejectWhenGroupSetIs = (dataElementGroupSetId) => (dataElementGroup) => dataElementGroup.dataElementGroupSet.id !== dataElementGroupSetId;
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
        d2.then(d2 => {
            const api = d2.Api.getApi();

            d2.models.dataElementGroupSet
                .list({paging: false, fields: 'id,name,displayName,dataElementGroups[id,name,displayName]'})
                .then(dataElementGroupSetsCollection => dataElementGroupSetsCollection.toArray())
                .then(dataElementGroupSets => this.setState({dataElementGroupSets}))
                .then(() => {
                    let oldDataElementGroups = modelToEditStore.getState().dataElementGroups
                        .filter(dataElementGroup => dataElementGroup.id)
                        .map(dataElementGroup => dataElementGroup.id);

                    // FIXME: This saves on every click on the save button / even when the model hasn't changed
                    this.saveSubscription = objectActions.saveObject.subscribe(({data: dataElementId}) => {
                        // Do not attempt to save when the model is not dirty
                        if (!modelToEditStore.getState().dirty) {
                            return;
                        }

                        const newDataElementGroups = modelToEditStore
                            .getState()
                            .dataElementGroups
                            .filter(dataElementGroup => dataElementGroup.id)
                            .map(dataElementGroup => dataElementGroup.id);

                        Promise.all(oldDataElementGroups
                                .filter(dataElementGroup => newDataElementGroups.indexOf(dataElementGroup) === -1)
                                .map(dataElementGroup => {
                                    return api.request('delete', `${api.baseUrl}/dataElementGroups/${dataElementGroup}/dataElements/${dataElementId}`)
                                })
                        )
                            .then(() => {
                                // Removed dataElementFromOld groups now save to new groups
                                return Promise.all(
                                    newDataElementGroups
                                        .filter(dataElementGroup => oldDataElementGroups.indexOf(dataElementGroup) === -1)
                                        .map(dataElementGroup => {
                                            return api.request('post', `${api.baseUrl}/dataElementGroups/${dataElementGroup}/dataElements/${dataElementId}`);
                                        })
                                );
                            })
                            .then(() => {
                                // Save successful, set the new values to be the "old ones"
                                oldDataElementGroups = newDataElementGroups;
                            });

                    });
                });
        });
    },

    componentWillUnmount() {
        if (this.saveSubscription.dispose) {
            this.saveSubscription.dispose();
        }
    },

    render() {
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
                        value: this.props.model.dataElementGroups
                            .filter(dataElementGroup => dataElementGroup.dataElementGroupSet.id === dataElementGroupSet.id)
                            .reduce((selectBoxValue, dataElementGroup) => {
                                if (dataElementGroup && dataElementGroup.id) {
                                    return dataElementGroup.id;
                                }
                            } , undefined),
                        onChange: function (value) {
                            const newDataElementGroups = this.props.model.dataElementGroups
                                .filter(rejectWhenGroupSetIs(dataElementGroupSet.id));
                            const dataElementGroupToAdd = getObjectWithId(dataElementGroupSet.dataElementGroups, value);

                            dataElementGroupToAdd.dataElementGroupSet = {id: dataElementGroupSet.id};
                            newDataElementGroups.push(dataElementGroupToAdd);

                            // TODO: Changing props is bad practice.. (Should ideally create a new model from data and set that, think `Model.clone();`)
                            this.props.model.dataElementGroups = newDataElementGroups;
                            modelToEditStore.setState(this.props.model);
                        }.bind(this),
                    };

                    return (
                        <div className="d2-input input-field" key={dataElementGroupSet.id}>
                            <div className="d2-select">
                                <ReactSelect {...reactSelectProps}></ReactSelect>
                            </div>
                            <label className="active" htmlFor={dataElementGroupSet.id}>{dataElementGroupSet.displayName}</label>
                        </div>
                    );
                })}
            </FormFields>
        );
    }
});

export default DataElementGroupsFields;
