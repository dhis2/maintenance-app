import category from './category';
import categoryCombo from './categoryCombo';
import categoryOptionGroup from './categoryOptionGroup';
import categoryOptionGroupSet from './categoryOptionGroupSet';

const disabledByType = {
    category,
    categoryCombo,
    categoryOptionGroup,
    categoryOptionGroupSet,
};

export default {
    for(schemaName) {
        if (schemaName && disabledByType[schemaName]) {
            return disabledByType[schemaName];
        }
        return [];
    },
};
