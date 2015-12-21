import Store from 'd2-flux/store/Store';
import {getInstance as getD2} from 'd2/lib/d2';

const sideBarItemsStore = Store.create();
const isInPredefinedList = (name) => {
    return [
        'dataElement',
        'dataElementGroup',
        'dataElementGroupSet',
        'categoryOptionCombo',
        'categoryOption',
        'category',
        'categoryCombo',
        'categoryOptionGroup',
        'categoryOptionGroupSet',
        'indicator',
        'indicatorType',
        'indicatorGroup',
        'indicatorGroupSet',
    ].indexOf(name) >= 0;
};

getD2().then((d2) => {
    const sideBarItems = d2.models
        .mapThroughDefinitions(definition => definition.name)
        .sort()
        .filter(isInPredefinedList);

    sideBarItemsStore.setState(sideBarItems);
});

export default sideBarItemsStore;
