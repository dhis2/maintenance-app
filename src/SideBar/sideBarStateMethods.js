export default {
    create() {
        return {
            hasStateFor(key) {
                return this.state && this.state[key];
            },

            isMainSection(sectionName) {
                return this.hasStateFor(sectionName);
            },

            getMainSections() {
                return Object
                    .keys(this.state)
                    .map(key => this.state[key].name);
            },

            getSubSectionsForParent(parentName) {
                console.log('Sidebar store state:', {});
                if (this.isMainSection(parentName)) {
                    return this.state[parentName].items;
                }
                return [];
            },

            getSideBarItems(groupName) {
                if (this.isMainSection(groupName)) {
                    return this.getSubSectionsForParent(groupName);
                }
                return this.getMainSections();
            },

            findSectionFor(itemName) {
                return Object
                    .keys(this.state)
                    .filter(key => {
                        return this.state[key] && (this.state[key].items.indexOf(itemName) >= -1);
                    })
                    .reduce((acc, value) => value);
            }
        };
    }
};
