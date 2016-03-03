import Store from 'd2-ui/lib/store/Store';
import { getInstance as getD2 } from 'd2/lib/d2';
import maintenanceModels from '../config/maintenance-models';

const sideBarItemNamesOrdered = maintenanceModels.getModelTypesToShowInSideBar();

const sideBarItemsStore = Store.create();

function isInPredefinedList(predefinedList) {
    return function isInPredefinedListFunc(name) {
        return predefinedList.indexOf(name) >= 0;
    };
}

getD2().then((d2) => {
    const modelDefinitionNames = d2.models.mapThroughDefinitions(definition => definition.name);
    const sideBarItems = sideBarItemNamesOrdered.filter(isInPredefinedList(modelDefinitionNames));

    sideBarItemsStore.setState(sideBarItems);
});

export default sideBarItemsStore;
