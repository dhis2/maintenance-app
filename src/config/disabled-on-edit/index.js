import categoryOptionGroup from './categoryOptionGroup';

const disabledByType = {
    categoryOptionGroup
};

export default {
    for(schemaName) {
        if (schemaName && disabledByType[schemaName]) {
            return disabledByType[schemaName];
        }
        return [];
    },
};
