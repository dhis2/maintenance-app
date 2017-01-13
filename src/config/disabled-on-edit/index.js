import category from './category';
import categoryCombo from './categoryCombo';
import categoryOptionCombo from './categoryOptionCombo';
import categoryOptionGroup from './categoryOptionGroup';
import categoryOptionGroupSet from './categoryOptionGroupSet';
import optionSet from './optionSet';

const disabledByType = {
    category,
    categoryCombo,
    categoryOptionCombo,
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
