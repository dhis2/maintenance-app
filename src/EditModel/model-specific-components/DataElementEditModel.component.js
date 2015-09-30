import React from 'react';
import EditModel from '../EditModel.component';
import {getInstance as getD2}  from 'd2';
import modelToEditStore from '../modelToEditStore';
import objectActions from '../objectActions';
import DataElementGroupsFields from './DataElementGroupsFields.component';

export default class extends EditModel {
    componentWillMount() {
        super.componentWillMount();

        modelToEditStore.subscribe(() => {
            if (!this.oldDataElementGroups) {
                this.oldDataElementGroups = (modelToEditStore.getState().dataElementGroups || [])
                    .filter(dataElementGroup => dataElementGroup.id)
                    .map(dataElementGroup => dataElementGroup.id);
            }
        });
    }

    afterSave({data: {id: dataElementId}}) {
        const newDataElementGroups = (modelToEditStore.getState().dataElementGroups || [])
            .filter(dataElementGroup => dataElementGroup.id)
            .map(dataElementGroup => dataElementGroup.id);

        return Rx.Observable.fromPromise(d2.then(() => {
            const api = getD2.Api.getApi();

            return Promise.all(this.oldDataElementGroups
                    .filter(dataElementGroup => newDataElementGroups.indexOf(dataElementGroup) === -1)
                    .map(dataElementGroup => {
                        return api.request('delete', `${api.baseUrl}/dataElementGroups/${dataElementGroup}/dataElements/${dataElementId}`);
                    })
                )
                .then(() => {
                    // Removed dataElementFromOld groups now save to new groups
                    console.log('new1: ', newDataElementGroups);
                    return Promise.all(
                        newDataElementGroups
                            .filter(dataElementGroup => this.oldDataElementGroups.indexOf(dataElementGroup) === -1)
                            .map(dataElementGroup => {
                                return api.request('post', `${api.baseUrl}/dataElementGroups/${dataElementGroup}/dataElements/${dataElementId}`);
                            })
                    );
                })
                .then(() => {
                    // Save successful, set the new values to be the "old ones"
                    this.oldDataElementGroups = newDataElementGroups;
                });
        }));
    }

    saveAction(event) {
        event.preventDefault();

        objectActions.saveObject({id: this.props.modelId, afterSave: this.afterSave.bind(this)})
            .subscribe(
            (message) => alert(message),
            (errorMessage) => alert(errorMessage)
        );
    }

    extraFieldsForModelType() {
        return (
            <DataElementGroupsFields model={this.state.modelToEdit} />
        );
    }
}
