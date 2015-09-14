import Store from 'd2-flux/store/Store';
import d2 from '../utils/d2';

const sideBarItemsStore = Store.create();

d2.then((d2) => {
    const sideBarItems = d2.models.mapThroughDefinitions(definition => {
        return definition.name;
    }).sort();

    sideBarItemsStore.setState(sideBarItems);
});

export default sideBarItemsStore;
