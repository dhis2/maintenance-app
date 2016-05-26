import category from './category';
import categoryCombo from './categoryCombo';
import categoryOptionGroup from './categoryOptionGroup';
import categoryOptionGroupSet from './categoryOptionGroupSet';
import optionSet from './optionSet';

const disabledByType = {
    category,
    categoryCombo,
    categoryOptionGroup,
    categoryOptionGroupSet,
    optionSet,
};

export default {
    for(schemaName) {
        if (schemaName && disabledByType[schemaName]) {
            return disabledByType[schemaName];
        }
        return [];
    },
};
