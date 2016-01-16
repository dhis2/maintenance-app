import Store from 'd2-flux/store/Store';
import {getInstance as getD2} from 'd2/lib/d2';

const sideBarItemNamesOrdered = [
    'categoryOption',
    'category',
    'categoryCombo',
    'categoryOptionCombo',
    'categoryOptionGroup',
    'categoryOptionGroupSet',
    'dataElement',
    'dataElementGroup',
    'dataElementGroupSet',
    'indicator',
    'indicatorType',
    'indicatorGroup',
    'indicatorGroupSet',
];

const sideBarItemsStore = Store.create();
const isInPredefinedList = (predefinedList) => {
    return function isInPredefinedListFunc(name) {
        return predefinedList.indexOf(name) >= 0;
    };
};

getD2().then((d2) => {
    const modelDefinitionNames = d2.models.mapThroughDefinitions(definition => definition.name);
    const sideBarItems = sideBarItemNamesOrdered.filter(isInPredefinedList(modelDefinitionNames));

    sideBarItemsStore.setState(sideBarItems);
});

export default sideBarItemsStore;
