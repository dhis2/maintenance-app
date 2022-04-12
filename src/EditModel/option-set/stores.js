import { Store } from '@dhis2/d2-ui-core';

export const optionDialogStore = Store.create();
export const sortDialogStore = Store.create({
    getInitialState() {
        return {};
    },
});

export const optionsForOptionSetStore = Store.create({
    getInitialState() {
        return {
            isLoading: true,
            options: [],
        };
    },
});
