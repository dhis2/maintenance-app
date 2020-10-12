import { Observable } from 'rxjs';
import { getInstance } from 'd2/lib/d2';

/*async function dataSetByOrgUnitApiEndPoint(){
    const d2 = await getInstance();
    return d2;
}*/
//const d2$ = Observable.fromPromise(getInstance());
//const dataSetByOrgUnitApiEndPointQ = d2$.map(d2 => d2.models.dataSet.apiEndpoint);

function dataSetByOrgUnitApiEndPoint() {
    const promise = getInstance().then((d2) => {
            let dataSetByOrgUnit = d2.models.dataSet.apiEndpoint;
            return dataSetByOrgUnit;
    });

    //.finally(() => dataSetByOrgUnit);

    //const promise = Promise.resolve(getInstance());

    /*const pr = await promise.then(dataSetByOrgUnitApiEndPoint => {
        return dataSetByOrgUnitApiEndPoint;
    });*/

    /*const pr = promise.then((d2) => {
        let dataSetByOrgUnitApiEndPoint = d2.models.dataSet.apiEndpoint;
        return dataSetByOrgUnitApiEndPoint;
    });*/

    return promise;

    // return promise.then(dataSetByOrgUnitApiEndPoint => dataSetByOrgUnitApiEndPoint);
    // const d2 = dataSetByOrgUnitApiEndPoint();
    // let dataSetByOrgUnitApiEndPoint = d2.models.dataSet.apiEndpoint;
    // return dataSetByOrgUnitApiEndPoint;
}

export default dataSetByOrgUnitApiEndPoint();
